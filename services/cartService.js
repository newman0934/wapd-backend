const db = require('../models')
const {
  Cart,
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

const cartService = {
  getUserCart: async (req, res, callback) => {
    const userCartResult = await User.findByPk(req.params.id, {
      include: {
        model: CartItem,
        include: [
          {
            model: Product,
            where: {
              status: 'on'
            },
            include: Image
          },
          Cart
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
      })),
      cartId: null || userCartResult.CartItems[0].CartId
    }

    return callback({ userCart })
  },
  notLoginPostCart: async (req, res, callback) => {
    if (!req.session.tempCartItems) {
      req.session.tempCartItems = []
    }
    for (let i = 0; i < req.session.tempCartItems.length; i++) {
      if (
        req.session.tempCartItems[i].ProductId === +req.body.productId &&
        req.session.tempCartItems[i].color === req.body.color &&
        req.session.tempCartItems[i].size === req.body.size
      ) {
        req.session.tempCartItems[i].quantity += Number(req.body.quantity)
        console.log('+++++++++++')
        console.log(req.session)
        console.log('+++++++++++')
        return callback({
          status: 'success',
          message: 'item successfully added into cart'
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
    console.log('+++++++++++')
    console.log(req.session)
    console.log('+++++++++++')
    return callback({
      status: 'success',
      message: 'item successfully added into cart'
    })
  },

  postCart: async (req, res, callback) => {
    const cartItem = await CartItem.findOne({
      where: {
        ProductId: +req.body.productId,
        size: req.body.size,
        color: req.body.color
      }
    })

    if (cartItem) {
      await cartItem.increment(['quantity'], { by: +req.body.quantity })
      return callback({
        status: 'success',
        message: 'item successfully added into cart'
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
      message: 'item successfully added into cart'
    })
  }
}

module.exports = cartService
