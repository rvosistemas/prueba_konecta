import { EntitySchema } from 'typeorm';
import BaseEntity from './BaseEntity.js';

const Request = new EntitySchema({
  name: 'Request',
  tableName: 'Requests',
  columns: {
    ...BaseEntity.options.columns,
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

export { Request };
