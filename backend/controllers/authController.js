const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AppDataSource } = require('../config/database');
const User = require('../models/User');
const UserRole = require('../config/roles');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      username,
      email,
      password,
      role: UserRole.EMPLOYEE,
    });

    await userRepository.save(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
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

exports.getUserProfile = async (req, res) => {
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

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const getRoles = Object.values(UserRole);

    if (!getRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided.' });
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await userRepository.save(user);

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
