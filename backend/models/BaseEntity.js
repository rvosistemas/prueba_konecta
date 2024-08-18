import { EntitySchema } from 'typeorm';

const BaseEntity = new EntitySchema({
  name: 'BaseEntity',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
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
  abstract: true,
});

export default BaseEntity;
