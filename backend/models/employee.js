module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hire_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    salary: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
      },
    },
  }, {
    tableName: 'employees',
    timestamps: false,
  });

  return Employee;
};
