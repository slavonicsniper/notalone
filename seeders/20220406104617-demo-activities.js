'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activities', [{
      id: 1,
      uuid: uuidv4(),
      name: 'CSGO',
      type: 'Gaming',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 2,
      uuid: uuidv4(),
      name: 'Road Cycling',
      type: 'Sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 3,
      uuid: uuidv4(),
      name: 'Table Tennis',
      type: 'Sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 4,
      uuid: uuidv4(),
      name: 'Swimming',
      type: 'Sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 5,
      uuid: uuidv4(),
      name: 'Programing',
      type: 'Studying',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 6,
      uuid: uuidv4(),
      name: 'Painting',
      type: 'Art',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activities', null, {});
  }
};
