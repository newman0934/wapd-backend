const orderService = require('../../services/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, data => {
      return res.json(data)
    })
  },
  postOrder: (req, res) => {
    orderService.postOrder(req, res, data => {
      return res.json(data)
    })
  },
  postCoupon: (req, res) => {
    orderService.postCoupon(req, res, data => {
      return res.json(data)
    })
  },
  getCheckout: (req, res) => {
    orderService.getCheckout(req, res, data => {
      return res.json(data)
    })
  },
  postCheckout: (req, res) => {
    orderService.postCheckout(req, res, data => {
      return res.json(data)
    })
  },
  getPayment: (req, res) => {
    orderService.getPayment(req, res, data => {
      return res.json(data)
    })
  },
  spgatewayCallback: (req, res) => {
    orderService.spgatewayCallback(req, res, data => {
      return res.json(data)
    })
  },
  getPaymentComplete: (req, res) => {
    orderService.getPaymentComplete(req, res, data => {
      return res.json(data)
    })
  },
  postTransition: (req, res) => {
    orderService.postTransition(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = orderController
