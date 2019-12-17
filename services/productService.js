const db = require('../models')
const Product = db.Product
const Category = db.Category
const ProductStatus = db.ProductStatus
const Favorite = db.Favorite
const Color = db.Color
const Size = db.Size
const Image = db.Image

const productService = {
  getProducts: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    // 若有 categoryId 會查詢對應類別的商品
    const productResult = await Product.findAll({
      include: [
        Image,
        Category,
        { model: ProductStatus, include: [Color, Size] }
      ]
    })
    const categories = await Category.findAll()

    return callback({
      productResult,
      categories,
      categoryId: +req.query.categoryId
    })
  },
  getProduct: async (req, res, callback) => {
    const productResult = await Product.findByPk(req.params.id, {
      include: [
        Image,
        Category,
        { model: ProductStatus, include: [Color, Size] }
      ]
    })

    return callback({ productResult })
  },

  addWishlist: async (req, res, callback) => {
    await Favorite.create({
      UserId: req.user.id,
      ProductId: req.params.id
    })
    return callback({
      status: 'success',
      message: '',
      ProductId: req.params.id
    })
  },

  deleteWishlist: async (req, res, callback) => {
    await Favorite.destroy({
      where: {
        UserId: req.user.id,
        ProductId: req.params.id
      }
    })
    return callback({
      status: 'success',
      message: '',
      ProductId: req.params.id
    })
  }
}

module.exports = productService
