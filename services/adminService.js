const db = require('../models')
const Product = db.Product
const Category = db.Category

const adminService = {
  getProducts: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    const productResult = await Product.findAll({
      include: Category,
      where: whereQuery
    })
    const categories = await Category.findAll()

    const data = productResult.map(r => ({
      ...r.dataValues
    }))
    return callback({
      products: data,
      categories,
      categoryId
    })
  },
  getProduct: async (req, res, callback) => {
    const product = await Product.findByPk(req.params.id, { include: Category })
    return callback({ product })
  }
}

module.exports = adminService
