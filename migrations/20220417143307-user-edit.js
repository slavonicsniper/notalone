'use strict';

const { ServiceUnavailable } = require("http-errors");

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.changeColumn(
          'users',
          'country',
          {
            allowNull: true,
            type: Sequelize.STRING
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'users',
          'city',
          {
            allowNull: true,
            type: Sequelize.STRING
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'users',
          'age',
          {
            allowNull: true,
            type: Sequelize.INTEGER
          },
          { transaction }
        )        
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
        queryInterface.changeColumn(
          'users',
          'country',
          {
            allowNull: false,
            type: Sequelize.STRING
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'users',
          'city',
          {
            allowNull: false,
            type: Sequelize.STRING
          },
          { transaction }
        ),
        queryInterface.changeColumn(
          'users',
          'age',
          {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          { transaction }
        )        
      ])
      await transaction.commit(); 
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
