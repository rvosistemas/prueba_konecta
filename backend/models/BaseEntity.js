const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
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
});
