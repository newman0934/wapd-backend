'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Orders',
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        total_price: faker.commerce.price(),
        shipping_method: Math.round(Math.random()),
        payment_status: Math.round(Math.random()),
        phone: faker.phone.phoneNumber(),
        payment_method: 'CREDIT',
        address: faker.address.streetAddress(),
        receiver_name: faker.name.findName(),
        sn: faker.random.number(),
        CouponId: Math.ceil(Math.random() * 3),
        UserId: Math.ceil(Math.random() * 30),
        email: faker.internet.exampleEmail(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {})
  }
}
