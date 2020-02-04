const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
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

    // 取出關聯資料
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

    return res.status(200).json({
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
        birthday: user.birthday,
        FavoritedProductsId: user.FavoritedProducts
          ? user.FavoritedProducts.map(d => d.id)
          : []
      }
    })
  },

  signUp: async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.passwordCheck) {
      return res
        .status(400)
        .json({ status: 'error', message: '請填妥每一個欄位！' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ status: 'error', message: '密碼長度不足！' })
    }

    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).json({
        status: 'error',
        message: '密碼不合法，需至少有一小寫字母！'
      })
    }

    if (req.body.passwordCheck !== req.body.password) {
      return res
        .status(400)
        .json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        return res.status(400).json({ status: 'error', message: '信箱重複！' })
      } else {
        const user = await User.create({
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          )
        })

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        // 如果 session 存在暫存的商品，正式將其加進會員的購物車
        if (req.session.tempCartItems) {
          req.session.tempCartItems.map(d => (d.UserId = user.id))
          await CartItem.bulkCreate(req.session.tempCartItems)
        }

        return res.status(200).json({
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
      }
    }
  },

  getUserOrders: (req, res) => {
    userService.getUserOrders(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getUserOrder: (req, res) => {
    userService.getUserOrder(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getUserWishlist: (req, res) => {
    userService.getUserWishlist(req, res, data => {
      return res.status(200).json(data)
    })
  },

  postPasswordChange: (req, res) => {
    userService.postPasswordChange(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  postPasswordForget: (req, res) => {
    userService.postPasswordForget(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  getPasswordReset: (req, res) => {
    userService.getPasswordReset(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  postPasswordReset: (req, res) => {
    userService.postPasswordReset(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  getUserEdit: (req, res) => {
    userService.getUserEdit(req, res, data => {
      return res.status(200).json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  }
}

module.exports = userController
