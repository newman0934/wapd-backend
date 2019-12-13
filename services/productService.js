const db = require('../models')
const Product = db.Product
const Category = db.Category
const ProductStatus = db.ProductStatus
const Color = db.Color
const Size = db.Size

const productService = {
  getProducts: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    const productResult = await ProductStatus.findAll({
      include: [{ model: Product, where: whereQuery }, Color, Size]
    })
    const categories = await Category.findAll()

    let products = productResult.map(data => ({
      id: data.dataValues.id,
      name: data.dataValues.Product.name,
      description: data.dataValues.Product.description,
      status: data.dataValues.Product.status,
      sales: data.dataValues.sales,
      stock: data.dataValues.stock,
      cost: data.dataValues.cost,
      price: data.dataValues.price,
      color: data.dataValues.Color.color,
      size: data.dataValues.Size.size,
      CategoryId: data.dataValues.Product.CategoryId,
      ProductId: data.dataValues.ProductId,
      createdAt: data.dataValues.Product.createdAt,
      updatedAt: data.dataValues.Product.updatedAt
    }))

    return callback({
      products,
      categories,
      categoryId: +req.query.categoryId
    })
  },
  getProduct: async (req, res, callback) => {
    const product = await Product.findByPk(req.params.id, { include: Category })
    return callback({ product })
  }
}

module.exports = productService
