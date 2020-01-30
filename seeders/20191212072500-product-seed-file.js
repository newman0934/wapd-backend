'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Products',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        description:
          faker.commerce.product() + '/' + faker.commerce.productName(),
        status: ['on', 'off'][Math.round(Math.random())],
        sell_price: faker.commerce.price(),
        origin_price: faker.commerce.price(),
        CategoryId: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
}
