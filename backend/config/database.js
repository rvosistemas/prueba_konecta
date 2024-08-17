require('dotenv').config();
require('reflect-metadata');
const { DataSource } = require('typeorm');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Request = require('../models/Request');

let synchronize = false;

if (process.env.NODE_ENV === 'development') {
  synchronize = true;
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: synchronize,
  logging: false,
  entities: [User, Employee, Request],
  migrations: ['src/migration/**/*.js'],
  subscribers: [],
});

module.exports = {
  AppDataSource,
};
