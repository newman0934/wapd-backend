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
  postCart: async (req, res, callback) => {
    console.log('+++++++++++')
    console.log(req.session)
    console.log('+++++++++++')
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0
      }
    }).spread(function(cart, created) {
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: +req.body.productId,
          size: req.body.size,
          color: req.body.color,
          quantity: +req.body.quantity
        },
        default: {
          CartId: cart.id,
          ProductId: +req.body.productId,
          size: req.body.size,
          color: req.body.color,
          quantity: +req.body.quantity
        }
      }).spread(function(cartItem, created) {
        // return cartItem
        //   .update({
        //     quantity: (cartItem.quantity || 0) + 1
        //   })
        // .then(cartItem => {
        req.session.cartId = cart.id
        return req.session.save(() => {
          return callback({
            status: 'success',
            message: 'item successfully added into cart!!'
          })
        })
        // })
      })
    })
  }
}

module.exports = cartService
