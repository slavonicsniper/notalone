'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.removeConstraint('inbox_messages', 'inbox_messages_from_fkey', { transaction }),
        queryInterface.removeConstraint('inbox_messages', 'inbox_messages_to_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('inbox_messages', 
          {
            type: 'foreign key',
            name: 'inbox_messages_from_fkey',
            fields: ['from'],
            references: {
              table: 'users',
              field: 'id'
            },
            onDelete: 'CASCADE',
            transaction
          },
        ),
        queryInterface.addConstraint('inbox_messages', 
          {
            type: 'foreign key',
            name: 'inbox_messages_to_fkey',
            fields: ['to'],
            references: {
              table: 'users',
              field: 'id'
            },
            onDelete: 'CASCADE',
            transaction
          },
        ),       
      ])
      await transaction.commit(); 
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.removeConstraint('inbox_messages', 'inbox_messages_from_fkey', { transaction }),
        queryInterface.removeConstraint('inbox_messages', 'inbox_messages_to_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('inbox_messages', 
          {
            type: 'foreign key',
            name: 'inbox_messages_from_fkey',
            fields: ['from'],
            references: {
              table: 'users',
              field: 'id'
            },
            transaction
          },
        ),
        queryInterface.addConstraint('inbox_messages', 
          {
            type: 'foreign key',
            name: 'inbox_messages_to_fkey',
            fields: ['to'],
            references: {
              table: 'users',
              field: 'id'
            },
            transaction
          },
        ),       
      ])
      await transaction.commit(); 
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};