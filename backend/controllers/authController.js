import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database.js';
import User from '../models/user.js';
import UserRole from '../config/roles.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const existingUserByUsername = await userRepository.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingUserByEmail = await userRepository.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });

    await userRepository.save(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: req.user.id },
      select: ['id', 'username', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



