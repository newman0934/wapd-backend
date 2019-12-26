'use strict'

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'OrderItems',
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        OrderId: Math.floor(index / 2) + 1,
        ProductId: Math.floor(Math.random() * 10) + 1,
        sell_price: Math.floor(Math.random() * 500) + 1,
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
