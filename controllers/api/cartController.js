const cartService = require('../../services/cartService')

const cartController = {
  getUserCart: (req, res) => {
    cartService.getUserCart(req, res, data => {
      return res.json(data)
    })
  },
  notLoginPostCart: (req, res) => {
    cartService.notLoginPostCart(req, res, data => {
      return res.json(data)
    })
  },

  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      return res.json(data)
    })
  },

  putCartQuantity: (req, res) => {
    cartService.putCartQuantity(req, res, data => {
      return res.json(data)
    })
  },

  deleteCartProduct: (req, res) => {
    cartService.deleteCartProduct(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = cartController
