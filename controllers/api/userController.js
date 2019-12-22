const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const userService = require('../../services/userService')

const userController = {
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: '請填妥每一個欄位！'
      })
    }
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: '查無此使用者' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
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
          address: user.address
        }
      })
    })
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            // name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
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

  getUserCart: (req, res) => {
    userService.getUserCart(req, res, data => {
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

  getUserEdit: (req, res) => {
    userService.getUserEdit(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
