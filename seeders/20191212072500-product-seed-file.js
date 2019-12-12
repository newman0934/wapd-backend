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
        cost: faker.commerce.price(),
        price: faker.commerce.price(),
        status: ['on', 'off'][Math.round(Math.random())],
        ImageId: Math.floor(Math.random() * 3) + 1,
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
