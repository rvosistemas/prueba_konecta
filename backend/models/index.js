const { AppDataSource } = require('../config/database');
const User = require('./User');
const Employee = require('./Employee');
const Request = require('./Request');

AppDataSource.initialize().then(() => {
  console.log('Database connected and models initialized.');
}).catch(err => console.error('Database initialization failed:', err));

module.exports = {
  User,
  Employee,
  Request,
};
