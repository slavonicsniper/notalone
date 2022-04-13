'use strict';
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: 1,
      uuid: uuidv4(),
      username: 'phoebe',
      email: 'phoebe@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Munich',
      country: 'Germany',
      age: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 2,
      uuid: uuidv4(),
      username: 'John',
      email: 'john@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'London',
      country: 'UK',
      age: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 3,
      uuid: uuidv4(),
      username: 'Alice',
      email: 'alice@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Helsinki',
      country: 'Finland',
      age: 22,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 4,
      uuid: uuidv4(),
      username: 'Joseph',
      email: 'Joseph@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Alaska',
      country: 'United States',
      age: 23,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 5,
      uuid: uuidv4(),
      username: 'Martin',
      email: 'marting@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Nitra',
      country: 'Slovakia',
      age: 24,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 6,
      uuid: uuidv4(),
      username: 'Daniel',
      email: 'daniel@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Kiev',
      country: 'Ukraine',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
