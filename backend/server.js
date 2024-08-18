import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import { AppDataSource } from './config/database.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection established');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/requests', requestRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
    process.exit(1);
  });
