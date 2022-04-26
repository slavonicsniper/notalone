'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.removeConstraint('users_activities', 'users_activities_user_id_fkey', { transaction }),
        queryInterface.removeConstraint('users_activities', 'users_activities_activity_id_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('users_activities', 
          {
            type: 'foreign key',
            name: 'users_activities_user_id_fkey',
            fields: ['user_id'],
            references: {
              table: 'users',
              field: 'id'
            },
            onDelete: 'CASCADE',
            transaction
          },
        ),
        queryInterface.addConstraint('users_activities', 
          {
            type: 'foreign key',
            name: 'users_activities_activity_id_fkey',
            fields: ['activity_id'],
            references: {
              table: 'activities',
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
        queryInterface.removeConstraint('users_activities', 'users_activities_user_id_fkey', { transaction }),
        queryInterface.removeConstraint('users_activities', 'users_activities_activity_id_fkey', { transaction }),
      ])
      await Promise.all([
        queryInterface.addConstraint('users_activities', 
          {
            type: 'foreign key',
            name: 'users_activities_user_id_fkey',
            fields: ['user_id'],
            references: {
              table: 'users',
              field: 'id'
            },
            transaction
          },
        ),
        queryInterface.addConstraint('users_activities', 
          {
            type: 'foreign key',
            name: 'users_activities_activity_id_fkey',
            fields: ['activity_id'],
            references: {
              table: 'activities',
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