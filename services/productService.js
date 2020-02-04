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
    let whereQuery = {
      status: 'on'
    }
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
      distinct: true,
      order: [['createdAt', 'DESC']]
    })

    const products = productResult.rows.map(data => ({
      id: data.dataValues.id,
      name: data.dataValues.name,
      description: data.dataValues.description,
      status: data.dataValues.status,
      CategoryId: data.dataValues.CategoryId,
      image: data.dataValues.Images,
      size: data.dataValues.ProductStatuses.map(d => d.Size.size),
      color: data.dataValues.ProductStatuses.map(d => d.Color.color),
      sell_price: data.dataValues.sell_price,
      origin_price: data.dataValues.origin_price,
      isFavorited: req.user
        ? req.user.FavoritedProducts.map(d => d.id).includes(data.dataValues.id)
        : false
    }))

    let page = Number(req.query.page) || 1
    let pages = Math.ceil(productResult.count / pageLimit)
    let totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    )
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1

    const categories = await Category.findAll()
    return callback({
      products,
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

    if (!productResult) {
      return callback({
        status: 'error',
        message: 'this product does not exist'
      })
    }
    if (productResult.status === 'off') {
      return callback({
        status: 'error',
        message: 'this product is currently not sale',
        ProductId: productResult.id
      })
    }

    const product = {
      id: productResult.dataValues.id,
      name: productResult.dataValues.name,
      description: productResult.dataValues.description,
      status: productResult.dataValues.status,
      CategoryId: productResult.dataValues.CategoryId,
      category: productResult.dataValues.Category.category,
      images: productResult.dataValues.Images,
      size: productResult.dataValues.ProductStatuses.map(d => d.Size.size),
      color: productResult.dataValues.ProductStatuses.map(d => d.Color.color),
      stock: productResult.dataValues.ProductStatuses.map(d => d.stock),
      origin_price: productResult.dataValues.origin_price,
      sell_price: productResult.dataValues.sell_price,
      isFavorited: req.user
        ? req.user.FavoritedProducts.map(d => d.id).includes(
            productResult.dataValues.id
          )
        : false
    }

    return callback({ product })
  },

  addWishlist: async (req, res, callback) => {
    const favorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,
        ProductId: req.params.id
      }
    })
    if (favorite) {
      return callback({
        status: 'error',
        message: "already in user's favorite list",
        ProductId: req.params.id
      })
    }
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
