const couponService = require('./../../services/couponService')

const couponController = {
  getCoupons: (req, res) => {
    couponService.getCoupons(req, res, data => {
      return res.json(data)
    })
  },
  addCoupon: (req, res) => {
    couponService.addCoupon(req, res, data => {
      return res.json(data)
    })
  },
  deleteCoupon: (req, res) => {
    couponService.deleteCoupon(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = couponController
