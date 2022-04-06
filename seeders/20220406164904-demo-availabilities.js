'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('availabilities', [{
      id: 1,
      uuid: uuidv4(),
      day: 'Monday',
      start_time: '01:00',
      end_time: '02:00',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 2,
      uuid: uuidv4(),
      day: 'Tuesday',
      start_time: '03:00',
      end_time: '04:00',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 3,
      uuid: uuidv4(),
      day: 'Wednesday',
      start_time: '05:00',
      end_time: '06:00',
      user_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 4,
      uuid: uuidv4(),
      day: 'Thursday',
      start_time: '07:00',
      end_time: '08:00',
      user_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 5,
      uuid: uuidv4(),
      day: 'Friday',
      start_time: '09:00',
      end_time: '10:00',
      user_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 6,
      uuid: uuidv4(),
      day: 'Saturday',
      start_time: '11:00',
      end_time: '12:00',
      user_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 7,
      uuid: uuidv4(),
      day: 'Sunday',
      start_time: '13:00',
      end_time: '14:00',
      user_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 8,
      uuid: uuidv4(),
      day: 'Monday',
      start_time: '15:00',
      end_time: '16:00',
      user_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 9,
      uuid: uuidv4(),
      day: 'Tuesday',
      start_time: '17:00',
      end_time: '18:00',
      user_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 10,
      uuid: uuidv4(),
      day: 'Wednesday',
      start_time: '19:00',
      end_time: '20:00',
      user_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 11,
      uuid: uuidv4(),
      day: 'Thursday',
      start_time: '21:00',
      end_time: '22:00',
      user_id: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 12,
      uuid: uuidv4(),
      day: 'Friday',
      start_time: '23:00',
      end_time: '00:00',
      user_id: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('availabilities', null, {});
  }
};
