'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.addColumn(
          'users',
          'status',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: 'Pending',
            validate: {
              isIn: [['Pending', 'Active']]
            }
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'users',
          'confirmation_code',
          {
            type: Sequelize.DataTypes.STRING,
            unique: true
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
        queryInterface.removeColumn('users', 'status', { transaction }),
        queryInterface.removeColumn('users', 'confirmation_code', { transaction })
      ]) 
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
