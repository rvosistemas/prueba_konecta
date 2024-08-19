import { AppDataSource } from '../config/database.js';
import User from '../models/user.js';
import UserRole from '../config/roles.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userRepository = AppDataSource.getRepository(User);
    const [users, count] = await userRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    })
    res.status(200).json({ users, count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
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
      role: role || UserRole.EMPLOYEE,
    });
    await userRepository.save(user);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (Object.values(UserRole).includes(role)) {
      user.role = role;
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    user.username = username;
    user.email = email;

    await userRepository.save(user);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = false;
    await userRepository.save(user);

    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRepository.remove(user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
