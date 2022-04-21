'use strict';
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      uuid: uuidv4(),
      username: 'phoebe',
      email: 'phoebe@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Munich',
      country: 'Germany',
      age: 1990,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      username: 'john',
      email: 'john@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Munich',
      country: 'Germany',
      age: 1995,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      username: 'alice',
      email: 'alice@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Helsinki',
      country: 'Finland',
      age: 2000,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      username: 'joseph',
      email: 'joseph@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Helsinki',
      country: 'Findland',
      age: 1991,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      username: 'martin',
      email: 'marting@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Nitra',
      country: 'Slovakia',
      age: 1970,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      username: 'daniel',
      email: 'daniel@notalone.com',
      password: await bcrypt.hash('Start123!', 10),
      city: 'Nitra',
      country: 'Slovakia',
      age: 1997,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
