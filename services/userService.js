const db = require('../models')
const User = db.User
const Order = db.Order
const Favorite = db.Favorite
const Product = db.Product
const CartItem = db.CartItem
const Cart = db.Cart

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
  },

  getUserCart: async (req, res, callback) => {
    const userCartResult = await User.findByPk(req.params.id, {
      include: { model: CartItem, include: [Product, Cart] }
    })

    const userCart = {
      id: userCartResult.id,
      email: userCartResult.email,
      name: userCartResult.name,
      role: userCartResult.role,
      phone: userCartResult.phone,
      address: userCartResult.address,
      cartItem: userCartResult.CartItems.map(data => ({
        id: data.id,
        stock: data.stock,
        quantity: data.quantity,
        name: data.Product.name,
        description: data.Product.description,
        status: data.Product.status,
        CategoryId: data.Product.CategoryId,
        ProductId: data.ProductId,
        CartId: data.CartId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      })),
      cartId: null || userCartResult.CartItems[0].CartId
    }

    return callback({ userCart })
  },

  postOrder: async (req, res, callback) => {
    // TODO: 新增一筆自己的訂單
  }
}

module.exports = userService
