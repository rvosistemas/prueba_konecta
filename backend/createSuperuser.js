require('dotenv').config();
const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const createSuperuser = async () => {
  try {
    await sequelize.sync();

    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !email || !password) {
      console.error('Admin username, email, and password must be set in the environment variables.');
      process.exit(1);
    }

    const adminExists = await User.findOne({ where: { email, role: 'admin' } });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      username,
      email,
      password: hashedPassword,
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
