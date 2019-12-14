const userService = require('../../services/userService')

const userController = {
  getUserOrders: (req, res) => {
    userService.getUserOrders(req, res, data => {
      return res.json(data)
    })
  },

  getUserOrder: (req, res) => {
    userService.getUserOrder(req, res, data => {
      return res.json(data)
    })
  },

  getUserFavorite: (req, res) => {
    userService.getUserFavorite(req, res, data => {
      return res.json(data)
    })
  },

  getUserCart: (req, res) => {
    userService.getUserCart(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
