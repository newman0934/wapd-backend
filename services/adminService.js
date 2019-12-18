const db = require('../models')
const Product = db.Product
const ProductStatus = db.ProductStatus
const Category = db.Category
const Color = db.Color
const Size = db.Size
const Order = db.Order
const User = db.User
const Image = db.Image
const pageLimit = 12

const adminService = {
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

  getProductStocks: async (req, res, callback) => {
    const productResult = await Product.findByPk(req.params.id, {
      include: [
        Image,
        Category,
        { model: ProductStatus, include: [Color, Size] }
      ]
    })

    return callback({ productResult })
  },

  getProductStock: async (req, res, callback) => {
    const productResult = await Product.findByPk(req.params.id, {
      include: [
        Image,
        Category,
        {
          model: ProductStatus,
          include: [Color, Size]
        }
      ]
    })
    const productStock = {
      ...productResult.dataValues,
      updateStockInfo: productResult.ProductStatuses.filter(
        item => item.id === +req.params.stock_id
      )
    }

    return callback({ productStock })
  },

  addProductStockProps: async (req, res, callback) => {
    if (!req.body.color || !req.body.size) {
      return callback({ status: 'error', message: 'missing props!!' })
    }
    const product = await Product.findByPk(req.params.id, {
      include: ProductStatus
    })
    const defaultProductInfo = product.ProductStatuses[0]
    const color = await Color.findOrCreate({
      where: {
        color: req.body.color
      }
    })
    const size = await Size.findOrCreate({
      where: {
        size: req.body.size
      }
    })
    // TODO: 確認有沒有符合的商品，如果有就不新增
    await ProductStatus.findOrCreate({
      where: {
        ProductId: req.params.id
      },
      include: [
        {
          model: Color,
          where: {
            color: req.body.color
          }
        },
        {
          model: Size,
          where: {
            size: req.body.size
          }
        }
      ],
      defaults: {
        sales: 0,
        stock: 0,
        ProductId: req.params.id,
        ColorId: color[0].id,
        SizeId: size[0].id,
        cost: defaultProductInfo.cost,
        price: defaultProductInfo.price
      }
    })
    return callback({ status: 'OK' })
  },

  getOrders: async (req, res, callback) => {
    const orderResult = await Order.findAll()

    return callback({ orderResult })
  },

  getOrder: async (req, res, callback) => {
    const orderResult = await Order.findByPk(req.params.id)

    return callback({ orderResult })
  },

  getUsers: async (req, res, callback) => {
    const userResult = await User.findAll()

    return callback({ userResult })
  },

  getUserOrders: async (req, res, callback) => {
    const userOrderResult = await User.findByPk(req.params.id, {
      include: Order
    })

    return callback({ userOrderResult })
  }
}

module.exports = adminService
