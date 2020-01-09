const db = require('../models')
const { Coupon, Product } = db

const couponService = {
  getCoupons: async (req, res, callback) => {
    const coupons = await Coupon.findAll({})
    return callback({ coupons })
  },
  addCoupon: async (req, res, callback) => {
    // 如果任一欄位為空會回傳錯誤
    if (!req.body.couponCode || !req.body.discountAmount) {
      return callback({
        status: 'error',
        message: 'must input every column'
      })
    }
    // 如果 discountAmount 非數字會回傳錯誤
    if (!Number.isInteger(+req.body.discountAmount)) {
      return callback({
        status: 'error',
        message: 'discountAmount must be an integer',
        discountAmount: req.body.discountAmount
      })
    }

    const [coupon, created] = await Coupon.findOrCreate({
      where: { coupon_code: req.body.couponCode },
      defaults: {
        coupon_code: req.body.couponCode,
        discount_amount: req.body.discountAmount
      }
    })
    // 如果 coupon 已存在會回傳錯誤
    if (!created) {
      return callback({
        status: 'error',
        message: 'coupon code already exist',
        CouponCode: coupon.coupon_code
      })
    }

    return callback({
      status: 'success',
      message: 'coupon is successfully created',
      CouponCode: coupon.coupon_code
    })
  },
  deleteCoupon: async (req, res, callback) => {
    const coupon = await Coupon.destroy({ where: { id: req.params.id } })
    return callback({
      status: 'success',
      message: 'coupon is successfully deleted',
      CouponId: coupon.id
    })
  }
}

module.exports = couponService
