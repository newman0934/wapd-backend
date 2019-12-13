'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Sizes',
      Array.from({ length: 3 }).map((item, index) => ({
        id: index + 1,
        size: ['S', 'M', 'L'][index],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sizes', null, {})
  }
}
