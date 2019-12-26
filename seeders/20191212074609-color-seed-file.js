'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Colors',
      Array.from({ length: 3 }).map((item, index) => ({
        id: index + 1,
        color: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Colors', null, {})
  }
}
