require('dotenv').config();
const { sequelize, User } = require('./models');

const createSuperuser = async () => {
  try {
    await sequelize.sync();

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

    const adminExists = await User.findOne({ where: { email, role: 'admin' } });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const adminUser = await User.create({
      username,
      email,
      password, // Plain password, will be hashed by the hook
      role: 'admin',
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await sequelize.close();
  }
};

createSuperuser();
