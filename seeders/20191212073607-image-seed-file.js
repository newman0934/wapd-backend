'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Images',
      Array.from({ length: 30 }).map((item, index) => ({
        id: index + 1,
        url: faker.image.imageUrl(),
        ProductId: Math.floor(index / 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Images', null, {})
  }
}
