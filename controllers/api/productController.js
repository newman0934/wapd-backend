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
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  deleteWishlist: (req, res) => {
    productService.deleteWishlist(req, res, data => {
      return res.status(200).json(data)
    })
  }
}

module.exports = productController
