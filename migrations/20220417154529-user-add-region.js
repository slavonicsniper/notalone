'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('users', 'region', {
       type: Sequelize.STRING,       
     });     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'region');
  }
};
