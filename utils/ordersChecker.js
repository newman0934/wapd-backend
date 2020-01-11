const db = require('../models')
const Order = db.Order
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// TODO: 設定一個計數器，每隔五分鐘撈一次所有訂單，並將 payment_status 為 null 且超過兩小時未更新的訂單 payment_status update 成 99，表示訂單已過期

function ordersChecker(checkPeriod, expireTime) {
  console.log('ordersChecker is running!')
  const timerId = setInterval(async function() {
    const orders = await Order.findAll({
      where: {
        payment_status: null,
        createdAt: {
          [Op.lt]: new Date(new Date() - expireTime)
        }
      }
    })
    orders.map(async function(order) {
      await order.update({
        payment_status: 99
      })
      console.log(
        `order id ${order.id} is expired. payment status updated to 99`
      )
    })
  }, checkPeriod)
}

module.exports = ordersChecker
