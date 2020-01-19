const orderService = require('../../services/orderService')

let orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, data => {
      return res.status(200).json(data)
    })
  },
  postOrder: (req, res) => {
    orderService.postOrder(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  postCoupon: (req, res) => {
    orderService.postCoupon(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  getCheckout: (req, res) => {
    orderService.getCheckout(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  postCheckout: (req, res) => {
    orderService.postCheckout(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  getPayment: (req, res) => {
    orderService.getPayment(req, res, data => {
      return res.status(200).json(data)
    })
  },
  spgatewayCallback: (req, res) => {
    orderService.spgatewayCallback(req, res, data => {
      return res.status(200).json(data)
    })
  },
  notifyURLCallback: (req, res) => {
    orderService.notifyURLCallback(req, res, data => {
      return res.status(200).json(data)
    })
  },
  getPaymentComplete: (req, res) => {
    orderService.getPaymentComplete(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  postTransition: (req, res) => {
    orderService.postTransition(req, res, data => {
      return res.status(200).json(data)
    })
  }
}

module.exports = orderController
