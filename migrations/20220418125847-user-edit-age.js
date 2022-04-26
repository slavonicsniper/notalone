'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.changeColumn('users', 'age', {
       type: Sequelize.STRING(4),       
     });     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'age', {
      type: 'INTEGER USING CAST("age" as INTEGER)',       
    });
  }
};
