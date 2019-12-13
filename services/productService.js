const db = require('../models')
const Product = db.Product

const productService = {
  getProducts: async (req, res, callback) => {
    const result = await Product.findAll()
    const data = result.map(r => ({
      ...r.dataValues
    }))
    return callback(data)
  }
}

module.exports = productService
