const { EntitySchema } = require('typeorm');
const UserRole = require('../config/roles');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'Users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    username: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      nullable: false,
    },
    role: {
      type: 'varchar',
      default: UserRole.EMPLOYEE,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});
