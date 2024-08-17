const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Request',
  tableName: 'Requests',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    code: {
      type: 'varchar',
      nullable: false,
    },
    description: {
      type: 'varchar',
      nullable: false,
    },
    summary: {
      type: 'varchar',
      nullable: false,
    },
    employee_id: {
      type: 'int',
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
  relations: {
    employee: {
      target: 'Employee',
      type: 'many-to-one',
      joinColumn: { name: 'employee_id' },
      cascade: true,
    },
  },
});
