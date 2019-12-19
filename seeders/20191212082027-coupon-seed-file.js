'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Coupons',
      Array.from({ length: 3 }).map((item, index) => ({
        id: index + 1,
        coupon_code: faker.lorem.word(),
        discount_amount: faker.commerce.price(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Coupons', null, {})
  }
}
