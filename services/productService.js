const db = require('../models')
const Product = db.Product
const Category = db.Category
const ProductStatus = db.ProductStatus
const Favorite = db.Favorite
const Color = db.Color
const Size = db.Size
const Image = db.Image
// 每頁顯示商品數
const pageLimit = 12

const productService = {
  getProducts: async (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    // 若有 categoryId 會查詢對應類別的商品
    const productResult = await Product.findAndCountAll({
      include: [
        Image,
        Category,
        { model: ProductStatus, include: [Color, Size] }
      ],
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
      // avoid counting associated data
      distinct: true
    })
    let page = Number(req.query.page) || 1
    let pages = Math.ceil(productResult.count / pageLimit)
    let totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    )
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1

    const categories = await Category.findAll()

    return callback({
      productResult,
      categories,
      categoryId: +req.query.categoryId,
      page,
      totalPage,
      prev,
      next
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
