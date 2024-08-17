require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const AppDataSource = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');

    app.use('/api/auth', authRoutes);
    app.use('/api/employees', employeeRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
    process.exit(1);
  });
