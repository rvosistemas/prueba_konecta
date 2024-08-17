const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Employee',
  tableName: 'Employees',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    hire_date: {
      type: 'date',
      nullable: false,
    },
    name: {
      type: 'varchar',
      nullable: false,
    },
    salary: {
      type: 'float',
      nullable: false,
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
