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
          name: faker.name.findName(),
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
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 8,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 9,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 10,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 11,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 12,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 13,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 14,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 15,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 16,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 17,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 18,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 19,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 20,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 21,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 22,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 23,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 24,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 25,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 26,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 27,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 28,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 29,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
          role: '',
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 30,
          email: faker.internet.exampleEmail(),
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: faker.name.findName(),
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
