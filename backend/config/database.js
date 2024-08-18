import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../models/user.js';
import { Employee } from '../models/employee.js';
import { Request } from '../models/request.js';

const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: isDevelopment,
  logging: isDevelopment ? ["query", "error", "schema", "warn", "info", "log"] : false,
  logger: isDevelopment ? "advanced-console" : undefined,
  entities: [User, Employee, Request],
  migrations: ['src/migration/**/*.js'],
  subscribers: [],
});
