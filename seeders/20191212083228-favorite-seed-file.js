'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Favorites',
      Array.from({ length: 9 }).map((item, index) => ({
        id: index + 1,
        UserId: (index % 3) + 1,
        ProductId: index + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Favorites', null, {})
  }
}
