const db = require('../models')
const {
  User,
  Order,
  Favorite,
  OrderItem,
  Product,
  CartItem,
  Coupon,
  Image,
  ProductStatus,
  Color,
  Size
} = db
const helpers = require('../_helpers')

const cartService = {
  getUserCart: async (req, res, callback) => {
    const userCartResult = await User.findByPk(req.user.id, {
      include: {
        model: CartItem,
        include: [
          {
            model: Product,
            where: {
              status: 'on'
            },
            include: Image
          }
        ]
      }
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
        color: data.color,
        size: data.size,
        images: data.Product.Images,
        origin_price: data.Product.origin_price,
        sell_price: data.Product.sell_price,
        CategoryId: data.Product.CategoryId,
        ProductId: data.ProductId,
        CartId: data.CartId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }))
    }

    return callback({ userCart })
  },

  notLoginPostCart: async (req, res, callback) => {
    if (+req.body.quantity <= 0) {
      return callback({
        status: 'error',
        message: 'quantity must be greater than 0!!'
      })
    }

    if (!req.session.tempCartItems) {
      req.session.tempCartItems = []
    }

    const product = await Product.findByPk(+req.body.productId)

    for (let i = 0; i < req.session.tempCartItems.length; i++) {
      if (
        req.session.tempCartItems[i].ProductId === +req.body.productId &&
        req.session.tempCartItems[i].color === req.body.color &&
        req.session.tempCartItems[i].size === req.body.size
      ) {
        req.session.tempCartItems[i].quantity += Number(req.body.quantity)
        return callback({
          status: 'success',
          message: 'item successfully added into cart',
          productSellPrice: product.sell_price
        })
      }
    }

    req.session.tempCartItems.push({
      ProductId: +req.body.productId,
      size: req.body.size,
      color: req.body.color,
      quantity: +req.body.quantity,
      UserId: null
    })
    return callback({
      status: 'success',
      message: 'item successfully added into cart',
      productSellPrice: product.sell_price,
      tempCartItems: req.session.tempCartItems
    })
  },

  postCart: async (req, res, callback) => {
    if (
      !req.body.productId ||
      !req.body.size ||
      !req.body.color ||
      !req.body.quantity
    ) {
      return callback({
        status: 'error',
        message: 'please fill every column!!'
      })
    }

    if (+req.body.quantity <= 0) {
      return callback({
        status: 'error',
        message: 'quantity must be greater than 0!!'
      })
    }

    const cartItem = await CartItem.findOne({
      where: {
        ProductId: +req.body.productId,
        size: req.body.size,
        color: req.body.color,
        UserId: req.user.id
      }
    })

    const product = await Product.findByPk(+req.body.productId)

    if (cartItem) {
      await cartItem.increment(['quantity'], { by: +req.body.quantity })
      return callback({
        status: 'success',
        message: 'item successfully added into cart',
        productSellPrice: product.sell_price
      })
    }

    await CartItem.create({
      ProductId: +req.body.productId,
      size: req.body.size,
      color: req.body.color,
      quantity: +req.body.quantity,
      UserId: req.user.id
    })

    return callback({
      status: 'success',
      message: 'item successfully added into cart',
      productSellPrice: product.sell_price
    })
  },

  putCartQuantity: async (req, res, callback) => {
    const cartItem = await CartItem.findByPk(req.params.item_id)
    if (!cartItem) {
      return callback({
        status: 'error',
        message: 'no matched cartItem found!!'
      })
    }
    if (!req.body.quantity) {
      return callback({
        status: 'error',
        message: 'please write quantity!!'
      })
    }

    if (+req.body.quantity <= 0) {
      return callback({
        status: 'error',
        message: 'quantity must be greater than 0!!'
      })
    }

    await cartItem.update({
      quantity: +req.body.quantity
    })
    return callback({
      status: 'success',
      message: 'cartItem updated successful!!',
      cartItemId: cartItem.id
    })
  },

  deleteCartProduct: async (req, res, callback) => {
    const cartItem = await CartItem.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    })

    if (!cartItem) {
      return callback({
        status: 'error',
        message: 'item deleted failed!!item not found'
      })
    }

    return callback({
      status: 'success',
      message: 'item is successfully deleted'
    })
  }
}

module.exports = cartService
