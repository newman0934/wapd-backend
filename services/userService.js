const db = require('../models')
const {
  User,
  Order,
  Product,
  Coupon,
  Image,
  ProductStatus,
  Color,
  Size,
  Token
} = db
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD
  }
})
const helpers = require('./../_helpers')
const domain =
  process.env.NODE_ENV === 'production'
    ? 'https://newman0934.github.io/wapd-frontend/#/'
    : 'http://localhost:8080/#/'

const userService = {
  getUserOrders: async (req, res, callback) => {
    const userOrderResult = await User.findByPk(req.user.id, {
      include: { model: Order, include: { model: Product, as: 'items' } }
    })

    const orders = userOrderResult.dataValues.Orders.map(d => ({
      id: d.dataValues.id,
      total_price: d.dataValues.total_price,
      shipping_status: d.dataValues.shipping_status,
      payment_status: d.dataValues.payment_status,
      UserId: d.dataValues.UserId,
      payment_method: d.dataValues.payment_method,
      comment: d.dataValues.comment,
      sn: d.dataValues.sn,
      createdAt: d.dataValues.createdAt,
      updatedAt: d.dataValues.updatedAt,
      OrderItems: d.dataValues.items.map(d => ({
        id: d.dataValues.OrderItem.id,
        sell_price: d.dataValues.OrderItem.sell_price,
        quantity: d.dataValues.OrderItem.quantity,
        createdAt: d.dataValues.OrderItem.createdAt,
        updatedAt: d.dataValues.OrderItem.updatedAt
      }))
    }))

    return callback({ orders })
  },

  getUserOrder: async (req, res, callback) => {
    const orders = await Order.findByPk(req.params.order_id, {
      include: [Coupon, { model: Product, as: 'items', include: Image }]
    })

    return callback({ orders })
  },

  getUserWishlist: async (req, res, callback) => {
    let userFavoriteResult = await User.findByPk(req.user.id, {
      include: {
        model: Product,
        required: false,
        as: 'FavoritedProducts',
        where: {
          status: 'on'
        },
        include: [Image, { model: ProductStatus, include: [Color, Size] }]
      }
    })

    const products = userFavoriteResult.dataValues.FavoritedProducts.map(d => ({
      id: d.dataValues.id,
      name: d.dataValues.name,
      description: d.dataValues.description,
      status: d.dataValues.status,
      categoryId: d.dataValues.CategoryId,
      image: d.dataValues.Images || [],
      color: d.dataValues.ProductStatuses.map(d => {
        return d.Color.color
      }),
      size: d.dataValues.ProductStatuses.map(d => {
        return d.Size.size
      }),
      origin_price: d.dataValues.origin_price,
      sell_price: d.dataValues.sell_price,
      isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(
        d.dataValues.id
      )
    }))

    return callback({ products })
  },

  postPasswordChange: async (req, res, callback) => {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return callback({
        status: 'error',
        message: 'no such user found!!',
        currentUserId: req.user.id
      })
    }
    // 舊密碼輸入錯誤
    if (!bcrypt.compareSync(req.body.usedPassword, user.password)) {
      return callback({
        status: 'error',
        message: 'old password does not match!!',
        currentUserId: req.user.id
      })
    }
    // 新密碼不吻合
    if (req.body.newPassword !== req.body.passwordCheck) {
      return callback({
        status: 'error',
        message: 'new passwords does not match!!',
        currentUserId: req.user.id
      })
    }
    // 密碼更新
    await user.update({
      password: bcrypt.hashSync(
        req.body.newPassword,
        bcrypt.genSaltSync(10),
        null
      )
    })

    return callback({
      status: 'success',
      message: 'password successfully changed'
    })
  },

  postPasswordForget: async (req, res, callback) => {
    // 使用者填入的 email
    const receiverEmail = req.body.email
    const randomToken = Math.random()
      .toString(32)
      .slice(-8)

    const user = await User.findOne({
      where: {
        email: receiverEmail
      }
    })
    // 如果查無 email 就提示對方此信箱尚未註冊
    if (!user) {
      return callback({
        status: 'error',
        message: 'This email is not registered yet!!'
      })
    }
    // 建立要發送至信箱的 token
    const token = await Token.create({
      token: randomToken,
      UserId: user.id,
      isUsed: false
    })
    // 信件內容
    const mailOptions = {
      from: `wapd official <${process.env.EMAIL_ACCOUNT}>`,
      to: receiverEmail,
      subject: `【wapd】忘記密碼認證函`,
      text: `您好：
      我們收到了您忘記密碼的請求，請點選以下連結重設密碼：
      ${domain}users/password_reset/${token.id}/${randomToken}/
      為了您帳號的安全，請勿將此連結洩漏給任何人，感謝您`
    }
    // 寄信
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    return callback({
      status: 'success',
      message: 'email successfully sent to user'
    })
  },

  getPasswordReset: async (req, res, callback) => {
    // 透過 params 尋找 token
    const token = await Token.findOne({
      where: {
        id: req.params.token_id,
        token: req.params.token,
        isUsed: false
      }
    })
    // 如果不符合就回傳 error
    if (!token) {
      return callback({
        status: 'error',
        message: 'No valid token found!!'
      })
    }
    // 如果符合就回傳 UserId
    return callback({
      status: 'success',
      message: 'token is valid!!',
      userId: token.UserId,
      token: token.token
    })
  },

  postPasswordReset: async (req, res, callback) => {
    // 檢查 req.body.password 及 req.body.passwordCheck 是否相同
    if (req.body.password !== req.body.passwordCheck) {
      return callback({
        status: 'error',
        message: 'passwords are different!!'
      })
    }
    // 先驗證 token (防Postman)
    const token = await Token.findOne({
      where: {
        token: req.body.token,
        UserId: req.body.userId,
        isUsed: false
      }
    })
    if (!token) {
      return callback({
        status: 'error',
        message: 'no token found!!'
      })
    }
    // 取得使用者 id，並加密密碼
    const user = await User.findByPk(req.body.userId)
    await user.update({
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    })
    await token.update({
      isUsed: true
    })
    // 回傳成功訊息
    return callback({
      status: 'success',
      message: 'user password reset successfully!!',
      UserId: req.body.userId
    })
  },

  getUserEdit: async (req, res, callback) => {
    const userResult = await User.findByPk(req.user.id)
    const user = {
      id: userResult.dataValues.id,
      email: userResult.dataValues.email,
      name: userResult.dataValues.name,
      phone: userResult.dataValues.phone,
      address: userResult.dataValues.address
    }

    return callback({ user })
  },

  putUser: async (req, res, callback) => {
    const user = await User.findByPk(helpers.getUser(req).id)
    if (!user) {
      return callback({
        status: 'error',
        message: 'user not found!!'
      })
    }

    if (!req.body.email) {
      return callback({
        status: 'error',
        message: 'must input email!!'
      })
    }

    await user.update(req.body)

    return callback({
      status: 'success',
      message: 'user successfully edited'
    })
  }
}

module.exports = userService
