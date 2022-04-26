'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.removeConstraint('availabilities', 'availabilities_user_id_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('availabilities', 
          {
            type: 'foreign key',
            name: 'availabilities_user_id_fkey',
            fields: ['user_id'],
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
        queryInterface.removeConstraint('availabilities', 'availabilities_user_id_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('availabilities', 
          {
            type: 'foreign key',
            name: 'availabilities_user_id_fkey',
            fields: ['user_id'],
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
