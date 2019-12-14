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
    // 若有 categoryId 會查詢對應類別的商品
    const productResult = await ProductStatus.findAll({
      include: [
        { model: Product, where: whereQuery, include: Category },
        Color,
        Size
      ]
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
      category: data.dataValues.Product.Category.category,
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
    const productResult = await ProductStatus.findByPk(req.params.id, {
      include: [{ model: Product, include: Category }, Color, Size]
    })

    const product = {
      id: productResult.id,
      name: productResult.Product.name,
      description: productResult.Product.description,
      status: productResult.Product.status,
      sales: productResult.sales,
      stock: productResult.stock,
      cost: productResult.cost,
      price: productResult.price,
      color: productResult.Color.color,
      size: productResult.Size.size,
      category: productResult.Product.Category.category,
      CategoryId: productResult.Product.CategoryId,
      ProductId: productResult.ProductId,
      createdAt: productResult.Product.createdAt,
      updatedAt: productResult.Product.updatedAt
    }

    return callback({ product })
  }
}

module.exports = adminService
