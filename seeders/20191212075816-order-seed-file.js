'use strict'
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Orders',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        amount: faker.random.number(),
        shipping_status: Math.floor(Math.random() * 2),
        payment_status: Math.round(Math.random()),
        UserId: Math.floor(Math.random() * 3) + 1,
        phone: faker.phone.phoneNumber(),
        payment_method: Math.round(Math.random()),
        address: faker.address.streetAddress(),
        receiver_name: faker.lorem.word(),
        comment: faker.lorem.sentence(),
        sn: faker.random.number(),
        CouponId: Math.floor(Math.random() * 3) + 1,
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
