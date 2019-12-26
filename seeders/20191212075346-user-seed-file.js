'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
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
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
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
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
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
