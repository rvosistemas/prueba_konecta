import { EntitySchema } from 'typeorm';
import UserRole from '../config/roles.js';
import BaseEntity from './BaseEntity.js';

const User = new EntitySchema({
  name: 'User',
  tableName: 'Users',
  columns: {
    ...BaseEntity.options.columns,
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
  },
});

export default User;
