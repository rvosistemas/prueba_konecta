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
  },
});

export { Employee };
