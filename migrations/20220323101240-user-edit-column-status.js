'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.renameColumn('users', 'status', 'confirmation_status')
    } catch(err) {
      throw err
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.renameColumn('users', 'confirmation_status', 'status')
    } catch(err) {
      throw err
    }
  }
};
