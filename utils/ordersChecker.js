const db = require('../models')
const Order = db.Order
const Sequelize = require('sequelize')
const Op = Sequelize.Op

async function checkExpired(expireTime) {
  const orders = await Order.findAll({
    where: {
      payment_status: null,
      createdAt: {
        [Op.lt]: new Date(new Date() - expireTime)
      }
    }
  })
  if (orders.length) {
    orders.map(async function(order) {
      await order.update({
        payment_status: 99
      })
      console.log(
        `order id ${order.id} is expired. payment status updated to 99`
      )
    })
  } else {
    console.log(`Orders checked, No expired orders`)
  }
}

// TODO: 設定一個計數器，每隔五分鐘撈一次所有訂單，並將 payment_status 為 null 且超過兩小時未更新的訂單 payment_status update 成 99，表示訂單已過期

function ordersChecker([hour, minute, second], expireTime) {
  let [hoursCount, minutesCount, secondsCount] = [0, 0, 0]
  let microseconds = hour * 3600000 + minute * 60000 + second * 1000
  let runningPeriod = microseconds
  while (microseconds >= 3600000) {
    microseconds -= 3600000
    hoursCount += 1
  }

  while (microseconds >= 60000) {
    microseconds -= 60000
    minutesCount += 1
  }

  while (microseconds >= 1000) {
    microseconds -= 1000
    secondsCount += 1
  }

  checkExpired(expireTime)

  console.log(
    `ordersChecker is running every ${hoursCount} hours ${minutesCount} minutes ${secondsCount} seconds`
  )
  const timerId = setInterval(async function() {
    checkExpired(expireTime)
  }, runningPeriod)
}

module.exports = ordersChecker
