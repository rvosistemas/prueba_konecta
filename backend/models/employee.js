import { EntitySchema } from 'typeorm';
import BaseEntity from './BaseEntity.js';

const Employee = new EntitySchema({
  name: 'Employee',
  tableName: 'Employees',
  columns: {
    ...BaseEntity.options.columns,
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
    user_id: {
      type: 'int',
      nullable: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: { name: 'user_id' },
      cascade: true,
    }
  },
});

export { Employee };
