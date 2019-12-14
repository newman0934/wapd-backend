const db = require('../models')
const User = db.User
const Order = db.Order
const Favorite = db.Favorite
const Product = db.Product

const userService = {
  getUserOrders: async (req, res, callback) => {
    const userOrderResult = await User.findByPk(req.params.id, {
      include: Order
    })

    return callback({ userOrderResult })
  },

  getUserOrder: async (req, res, callback) => {
    const userOrderResult = await User.findByPk(req.params.id, {
      include: { model: Order, where: { id: req.params.order_id } }
    })

    return callback({ userOrderResult })
  },

  getUserFavorite: async (req, res, callback) => {
    const userFavoriteResult = await User.findByPk(req.params.id, {
      include: { model: Product, as: 'FavoritedProducts' }
    })

    return callback({ userFavoriteResult })
  }
}

module.exports = userService
