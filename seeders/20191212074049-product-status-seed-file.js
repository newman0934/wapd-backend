'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'ProductStatuses',
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        sales: Math.floor(Math.random() * 10),
        stock: Math.floor(Math.random() * 10),
        cost: faker.commerce.price(),
        price: faker.commerce.price(),
        ColorId: Math.floor(Math.random() * 3) + 1,
        ProductId: Math.floor(Math.random() * 10) + 1,
        SizeId: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProductStatuses', null, {})
  }
}
