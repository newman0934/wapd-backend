const productService = require('../../services/productService')

const productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      return res.status(200).json(data)
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, data => {
      return res.status(200).json(data)
    })
  },

  addWishlist: (req, res) => {
    productService.addWishlist(req, res, data => {
      return res.json(data)
    })
  },

  deleteWishlist: (req, res) => {
    productService.deleteWishlist(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = productController
