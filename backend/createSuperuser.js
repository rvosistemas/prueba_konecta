import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './config/database.js';
import User from './models/user.js';

const createSuperuser = async () => {
  try {
    await AppDataSource.initialize();

    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    console.log('Username -> ', username);
    console.log('Email -> ', email);
    console.log('Password -> ', password);

    if (!username || !email || !password) {
      console.error('Admin username, email, and password must be set in the environment variables.');
      process.exit(1);
    }

    const userRepository = AppDataSource.getRepository(User);

    const adminExists = await userRepository.findOne({ where: { email, role: 'admin' } });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await userRepository.save(adminUser);

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await AppDataSource.destroy();
  }
};

createSuperuser();
