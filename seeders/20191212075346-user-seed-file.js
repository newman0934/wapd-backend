'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          email: 'root@example.com',
          password: '12345678',
          name: 'root',
          role: 'admin',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'user1@example.com',
          password: '12345678',
          name: 'Caesar',
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          email: 'user2@example.com',
          password: '12345678',
          name: 'Vivian',
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
