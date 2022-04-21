'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activities', [{
      uuid: uuidv4(),
      name: 'csgo',
      type: 'gaming',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: 'road cycling',
      type: 'sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: 'table tennis',
      type: 'sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: 'swimming',
      type: 'sport',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: 'programming',
      type: 'studying',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: 'painting',
      type: 'art',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activities', null, {});
  }
};
