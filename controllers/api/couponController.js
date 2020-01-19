const couponService = require('./../../services/couponService')

const couponController = {
  getCoupons: (req, res) => {
    couponService.getCoupons(req, res, data => {
      return res.status(200).json(data)
    })
  },
  addCoupon: (req, res) => {
    couponService.addCoupon(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  deleteCoupon: (req, res) => {
    couponService.deleteCoupon(req, res, data => {
      return res.status(200).json(data)
    })
  }
}

module.exports = couponController
