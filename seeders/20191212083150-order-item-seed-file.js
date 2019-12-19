'use strict'

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'OrderItems',
      Array.from({ length: 10 }).map((item, index) => ({
        OrderId: Math.floor(Math.random() * 2) + 1,
        ProductId: Math.floor(Math.random() * 10) + 1,
        price: Math.floor(Math.random() * 500) + 1,
        quantity: Math.floor(Math.random() * 10) + 1,
        color: faker.lorem.word(),
        size: ['S', 'M', 'L'][Math.floor(Math.random() * 3)],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {})
  }
}
