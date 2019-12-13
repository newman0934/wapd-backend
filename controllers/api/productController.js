const productService = require('../../services/productService')

const productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      console.log('data: ' + data)
      return res.json(data)
    })
  }
}

module.exports = productController
