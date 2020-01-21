const cartService = require('../../services/cartService')

const cartController = {
  getUserCart: (req, res) => {
    cartService.getUserCart(req, res, data => {
      return res.status(200).json(data)
    })
  },
  notLoginPostCart: (req, res) => {
    cartService.notLoginPostCart(req, res, data => {
      return res.status(200).json(data)
    })
  },

  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  putCartQuantity: (req, res) => {
    cartService.putCartQuantity(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  deleteCartProduct: (req, res) => {
    cartService.deleteCartProduct(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  }
}

module.exports = cartController
