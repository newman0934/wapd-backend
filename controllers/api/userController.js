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
      // 簽發 token
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
          role: user.role
        }
      })
    })
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
