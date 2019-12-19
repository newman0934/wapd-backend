const db = require('../models')
const Product = db.Product
const ProductStatus = db.ProductStatus
const Category = db.Category
const Color = db.Color
const Size = db.Size
const Order = db.Order
const User = db.User
const Coupon = db.Coupon
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
      include: [Image, Category],
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

    const products = productResult.rows.map(d => ({
      id: d.dataValues.id,
      cost: d.dataValues.cost,
      sell_price: d.dataValues.sell_price,
      status: d.dataValues.status,
      images: d.dataValues.Images
    }))

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
      include: Category
    })

    const product = {
      id: productResult.dataValues.id,
      name: productResult.dataValues.name,
      description: productResult.dataValues.description,
      cost: productResult.dataValues.cost,
      origin_price: productResult.dataValues.origin_price,
      sell_price: productResult.dataValues.sell_price,
      CategoryId: productResult.dataValues.CategoryId,
      category: productResult.dataValues.Category.category
    }

    return callback({ product })
  },

  getProductStocks: async (req, res, callback) => {
    const result = await ProductStatus.findByPk(req.params.id, {
      include: [Size, Color]
    })

    const productStatus = {
      id: result.dataValues.id,
      stock: result.dataValues.stock,
      size: result.dataValues.Size.size,
      color: result.dataValues.Color.color,
      ProductId: result.dataValues.ProductId
    }

    return callback({ productStatus })
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
    const orders = orderResult.map(d => ({
      id: d.dataValues.id,
      sn: d.dataValues.sn,
      receiver_name: d.dataValues.receiver_name,
      phone: d.dataValues.phone,
      address: d.dataValues.address,
      payment_status: d.dataValues.payment_status,
      payment_method: d.dataValues.payment_method
    }))
    return callback({ orders })
  },

  getOrder: async (req, res, callback) => {
    const orderResult = await Order.findByPk(req.params.id, {
      include: [Coupon, { model: Product, as: 'items' }]
    })
    const order = {
      id: orderResult.dataValues.id,
      UserId: orderResult.dataValues.UserId,
      receiver_name: orderResult.dataValues.receiver_name,
      phone: orderResult.dataValues.phone,
      address: orderResult.dataValues.address,
      payment_status: orderResult.dataValues.payment_status,
      payment_method: orderResult.dataValues.payment_method,
      orderItems: orderResult.dataValues.items.map(d => ({
        ProductId: d.dataValues.id,
        ProductName: d.dataValues.name,
        size: d.dataValues.OrderItem.size,
        color: d.dataValues.OrderItem.color,
        SellPrice: d.dataValues.OrderItem.price
      })),
      coupon: {
        id: orderResult.dataValues.Coupon.id,
        coupon_code: orderResult.dataValues.Coupon.coupon_code,
        discount_amount: orderResult.dataValues.Coupon.discount_amount
      }
    }

    return callback({ order })
  },

  putOrder: async (req, res, callback) => {
    const order = await Order.findByPk(req.params.id)
    await order.update({
      amount: +req.body.amount,
      shipping_status: req.body.shipping_status,
      payment_status: req.body.payment_status,
      phone: req.body.phone,
      payment_method: req.body.payment_method,
      address: req.body.address,
      receiver_name: req.body.receiver_name,
      comment: req.body.comment
    })

    return callback({
      status: 'OK',
      message: 'update successful',
      OrderId: req.params.id
    })
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
