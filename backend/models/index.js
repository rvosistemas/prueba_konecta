const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const Employee = require('./employee')(sequelize, Sequelize);
const Request = require('./request')(sequelize, Sequelize);
const User = require('./user')(sequelize, Sequelize);

Employee.hasMany(Request, { foreignKey: 'employee_id', as: 'requests' });
Request.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = {
  sequelize,
  Employee,
  Request,
  User,
};
