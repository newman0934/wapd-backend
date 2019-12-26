const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const Favorite = db.Favorite
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const userService = require('../../services/userService')

const userController = {
  signIn: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: '請填妥每一個欄位！'
      })
    }
    let username = req.body.email
    let password = req.body.password
    // 嘗試尋找關聯
    let user = await User.findOne({
      where: { email: username },
      include: [
        {
          model: Product,
          required: false,
          as: 'FavoritedProducts',
          where: {
            status: 'on'
          }
        }
      ]
    })

    if (!user)
      return res.status(401).json({ status: 'error', message: '查無此使用者' })
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: '密碼錯誤' })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    // TODO: req.session.tempCartItems 若與會員購物車有相同商品則增加至會員購物車，但不能用迴圈打DB...
    // 先把關聯的資料抓出來!!!!
    const userCartItems = await CartItem.findAll({
      where: {
        UserId: user.id
      }
    })

    // 如果 session 存在暫存的商品，正式將其加進會員的購物車
    if (req.session.tempCartItems) {
      req.session.tempCartItems.map(d => (d.UserId = user.id))
      // 如果使用者有完全相同的商品，則增加數量至其商品
      if (userCartItems) {
        for (let i = 0; i < userCartItems.length; i++) {
          for (let j = 0; j < req.session.tempCartItems.length; j++) {
            // 如果使用者購物車與登入前的購物車有重複商品
            if (
              userCartItems[i].ProductId ===
                req.session.tempCartItems[j].ProductId &&
              userCartItems[i].color === req.session.tempCartItems[j].color &&
              userCartItems[i].size === req.session.tempCartItems[j].size
            ) {
              // 就增加數量至使用者購物車
              await userCartItems[i].increment(['quantity'], {
                by: Number(req.session.tempCartItems[j].quantity)
              })

              req.session.tempCartItems.splice(j, 1)
              j -= 1
            }
          }
        }
      }
      await CartItem.bulkCreate(req.session.tempCartItems)
    }

    return res.json({
      status: 'success',
      message: 'ok',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        FavoritedProductsId: user.FavoritedProducts
          ? user.FavoritedProducts.map(d => d.id)
          : []
      }
    })
  },

  signUp: async (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        return res.json({ status: 'error', message: '信箱重複！' })
      } else {
        const user = await User.create({
          // name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          )
        })

        // await Favorite.create({
        //   UserId: user.id,
        //   ProductId: 1
        // })

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        // 建立未登入時使用的購物車關聯
        if (req.session.cartId) {
          const cartItems = await CartItem.findAll({
            where: {
              CartId: req.session.cartId
            }
          })

          cartItems.forEach(async function(instance) {
            await instance.update({ UserId: user.id })
          })
        }

        return res.json({
          status: 'success',
          message: '成功註冊帳號及登入！',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            FavoritedProductsId: []
          }
        })
        // .then(user => {
        //   return res.json({ status: 'success', message: '成功註冊帳號！' })
        // })
      }
    }
  },

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

  getUserWishlist: (req, res) => {
    userService.getUserWishlist(req, res, data => {
      return res.json(data)
    })
  },

  getPasswordChange: (req, res) => {
    userService.getPasswordChange(req, res, data => {
      return res.json(data)
    })
  },

  postPasswordChange: (req, res) => {
    userService.postPasswordChange(req, res, data => {
      return res.json(data)
    })
  },

  postPasswordForget: (req, res) => {
    userService.postPasswordForget(req, res, data => {
      return res.json(data)
    })
  },

  getPasswordReset: (req, res) => {
    userService.getPasswordReset(req, res, data => {
      return res.json(data)
    })
  },

  postPasswordReset: (req, res) => {
    userService.postPasswordReset(req, res, data => {
      return res.json(data)
    })
  },

  getUserEdit: (req, res) => {
    userService.getUserEdit(req, res, data => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
