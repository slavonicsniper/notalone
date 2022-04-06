'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users_activities', [{
      user_id: 1,
      activity_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 1,
      activity_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 2,
      activity_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 2,
      activity_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 3,
      activity_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 3,
      activity_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 4,
      activity_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 4,
      activity_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 5,
      activity_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 5,
      activity_id: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 6,
      activity_id: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 6,
      activity_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_activities', null, {});
  }
};
