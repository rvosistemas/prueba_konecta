module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define('Request', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    summary: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    employee_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'employees',
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    tableName: 'requests',
    timestamps: false,
  });

  return Request;
};
