const db = require('../models')
const {
  Product,
  ProductStatus,
  Category,
  Color,
  Size,
  Order,
  User,
  Coupon,
  OrderItem,
  Image
} = db
const pageLimit = 12
const fs = require('fs')
const imgur = require('imgur-node-api')
const path = require('path')

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
      name: d.dataValues.name,
      category: d.dataValues.Category.category,
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
      include: [Category, Image]
    })

    const product = {
      id: productResult.dataValues.id,
      name: productResult.dataValues.name,
      description: productResult.dataValues.description,
      origin_price: productResult.dataValues.origin_price,
      sell_price: productResult.dataValues.sell_price,
      CategoryId: productResult.dataValues.CategoryId,
      category: productResult.dataValues.Category.category,
      status: productResult.dataValues.status,
      images: productResult.dataValues.Images
    }

    return callback({ product })
  },

  addProduct: async (req, res, callback) => {
    // 預防提交空資料
    if (
      !req.body.name ||
      !req.body.categoryId ||
      !req.body.originPrice ||
      !req.body.sellPrice ||
      !req.body.description
    ) {
      return callback({
        status: 'error',
        message: 'every column is required!!'
      })
    }
    let productResult = await Product.findOne({
      where: { name: req.body.name }
    })
    if (productResult) {
      return callback({
        status: 'error',
        message: 'same product name already existed!!'
      })
    }
    productResult = await Product.create({
      name: req.body.name,
      CategoryId: req.body.categoryId,

      origin_price: req.body.originPrice,
      sell_price: req.body.sellPrice,
      description: req.body.description,
      status: 'off'
    })

    const { files } = req
    if (files) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      for (let i = 0; i < files.length; i++) {
        imgur.upload(files[i].path, async (err, img) => {
          await Image.create({
            url: img.data.link,
            ProductId: productResult.id
          })
        })
      }
    }

    return callback({
      status: 'success',
      message: 'products successfully created!!',
      productId: productResult.id
    })
  },

  putProduct: async (req, res, callback) => {
    if (
      !req.body.name ||
      !req.body.categoryId ||
      !req.body.originPrice ||
      !req.body.sellPrice ||
      !req.body.description ||
      !req.body.status
    ) {
      return callback({
        status: 'error',
        message: 'every column is required!!'
      })
    }
    console.log('*********req.params.id**********')
    console.log(req.params.id)
    console.log('*********req.body**********')
    console.log(req.body)
    console.log('*********req.files**********')
    console.log(req.files)
    // 若查到其他相同的商品名稱就回傳 error
    let productResult = await Product.findOne({
      where: { name: req.body.name }
    })
    if (productResult) {
      if (productResult.id !== +req.params.id) {
        return callback({
          status: 'error',
          message: 'same product name already existed!!'
        })
      }
    } else {
      productResult = await Product.findByPk(req.params.id)
    }

    productResult.update({
      name: req.body.name,
      categoryId: req.body.categoryId,
      originPrice: req.body.originPrice,
      sellPrice: req.body.sellPrice,
      description: req.body.description,
      status: req.body.status
    })
    if (req.files) {
      const { files } = req
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      for (let i = 0; i < files.length; i++) {
        imgur.upload(files[i].path, async (err, img) => {
          await Image.create({
            url: img.data.link,
            ProductId: productResult.id
          })
        })
      }
      console.log('*****files*****')
      console.log(files)
    }

    return callback({
      status: 'success',
      message: 'product was successfully updated!!'
    })
  },

  deleteImage: async (req, res, callback) => {
    const image = await Image.findByPk(req.params.id)
    if (!image) {
      return callback({
        status: 'error',
        message: 'no such image found!!'
      })
    }
    await image.destroy({
      where: {
        id: req.params.id
      }
    })
    return callback({
      status: 'success',
      message: 'Image successfully deleted!!'
    })
  },

  deleteProduct: async (req, res, callback) => {
    const productResult = await Product.findByPk(req.params.id, {
      include: ProductStatus
    })
    if (productResult.ProductStatuses.length) {
      return callback({
        status: 'error',
        message:
          'product cannot be deleted if is associated to any productstatuses!!'
      })
    }
    await productResult.destroy()
    return callback({
      status: 'success',
      message: 'product was successfully deleted!!'
    })
  },

  getProductStocks: async (req, res, callback) => {
    const result = await Product.findByPk(req.params.id, {
      include: { model: ProductStatus, include: [Size, Color] }
    })

    const productStatus = result.ProductStatuses.map(d => ({
      id: d.dataValues.id,
      stock: d.dataValues.stock,
      size: d.dataValues.Size.size,
      color: d.dataValues.Color.color,
      ProductId: d.dataValues.ProductId
    }))

    return callback({ productStatus })
  },

  getProductStockEdit: async (req, res, callback) => {
    const result = await Product.findByPk(req.params.id, {
      include: {
        model: ProductStatus,
        include: [Size, Color],
        where: { id: +req.params.stock_id }
      }
    })

    if (!result) {
      callback({
        status: 'error',
        message: 'can not find any product stock!!'
      })
    }

    const productStatus = {
      id: result.ProductStatuses[0].id,
      stock: result.ProductStatuses[0].stock,
      size: result.ProductStatuses[0].Size.size,
      color: result.ProductStatuses[0].Color.color,
      ProductId: result.ProductStatuses[0].ProductId
    }

    return callback({ productStatus })
  },

  putProductStockProps: async (req, res, callback) => {
    const color = await Color.findOrCreate({
      where: { color: req.body.color }
    })
    const size = await Size.findOrCreate({
      where: { size: req.body.size }
    })
    const productStatus = await ProductStatus.findByPk(req.params.stock_id)
    await productStatus.update({
      stock: req.body.stock,
      ColorId: color[0].id,
      SizeId: size[0].id
    })

    return callback({
      status: 'success',
      message: 'successfully edited',
      productId: req.params.id
    })
  },

  addProductStockProps: async (req, res, callback) => {
    if (!req.body.color || !req.body.size) {
      return callback({ status: 'error', message: 'missing props!!' })
    }
    const product = await Product.findByPk(req.params.id, {
      include: { model: ProductStatus, required: false }
    })
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
        SizeId: size[0].id
      }
    })
    return callback({ status: 'OK' })
  },

  deleteProductStockProp: async (req, res, callback) => {
    const productStatusResult = await ProductStatus.findByPk(
      req.params.stock_id
    )

    if (!productStatusResult) {
      return callback({
        status: 'error',
        message: 'no matching productStatus founded!!'
      })
    }
    await productStatusResult.destroy()
    return callback({
      status: 'success',
      message: 'productStatus is successfully deleted!!'
    })
  },

  getOrders: async (req, res, callback) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    const orderResult = await Order.findAndCountAll({
      offset: offset,
      limit: pageLimit
    })

    let page = Number(req.query.page) || 1
    let pages = Math.ceil(orderResult.count / pageLimit)

    let totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    )
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1
    const orders = orderResult.rows.map(d => ({
      id: d.dataValues.id,
      UserId: d.dataValues.UserId,
      sn: d.dataValues.sn,
      total_price: d.dataValues.total_price,
      shipping_status: 0,
      shipping_method: d.dataValues.shipping_method,
      receiver_name: d.dataValues.receiver_name,
      phone: d.dataValues.phone,
      address: d.dataValues.address,
      payment_status: d.dataValues.payment_status,
      payment_method: d.dataValues.payment_method
    }))
    return callback({
      orders,
      page,
      totalPage,
      prev,
      next
    })
  },

  getOrder: async (req, res, callback) => {
    const orderResult = await Order.findByPk(req.params.id, {
      include: [Coupon, { model: Product, as: 'items' }]
    })
    if (!orderResult) {
      return callback({
        status: 'error',
        message: 'no such order found!!'
      })
    }

    const orderitems = await OrderItem.findAll({
      where: {
        OrderId: req.params.id
      }
    })

    const order = {
      id: orderResult.dataValues.id,
      UserId: orderResult.dataValues.UserId,
      receiver_name: orderResult.dataValues.receiver_name,
      total_price: orderResult.dataValues.total_price,
      sn: orderResult.dataValues.sn,
      shipping_status: orderResult.dataValues.shipping_status,
      shipping_method: orderResult.dataValues.shipping_method,
      phone: orderResult.dataValues.phone,
      address: orderResult.dataValues.address,
      payment_status: orderResult.dataValues.payment_status,
      payment_method: orderResult.dataValues.payment_method,
      comment: orderResult.dataValues.comment,
      orderItems: orderitems.map(d => ({
        ProductId: d.id,
        ProductName: d.product_name,
        size: d.size,
        color: d.color,
        SellPrice: d.sell_price,
        quantity: d.quantity
      })),
      coupon: orderResult.dataValues.Coupon
        ? {
            id: orderResult.dataValues.Coupon.id,
            coupon_code: orderResult.dataValues.Coupon.coupon_code,
            discount_amount: orderResult.dataValues.Coupon.discount_amount
          }
        : null
    }

    return callback({ order })
  },

  putOrder: async (req, res, callback) => {
    const order = await Order.findByPk(req.params.id)

    await order.update(req.body)

    return callback({
      status: 'OK',
      message: 'update successful',
      OrderId: req.params.id
    })
  },

  deleteOrderProduct: async (req, res, callback) => {
    const orderItem = await OrderItem.findOne({
      where: {
        OrderId: req.params.id,
        product_name: req.body.productName,
        color: req.body.color,
        size: req.body.size
      }
    })
    if (!orderItem) {
      return callback({
        status: 'error',
        message: 'no such orderItem found!!'
      })
    }
    const deletedOrderItem = await orderItem.destroy()
    return callback({
      status: 'success',
      message: 'orderItem successfully deleted!!',
      deletedOrderItemId: deletedOrderItem.id,
      OrderId: req.params.id
    })
  },

  getUsers: async (req, res, callback) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const users = await User.findAndCountAll({
      offset: offset,
      limit: pageLimit
    })
    let page = Number(req.query.page) || 1
    let pages = Math.ceil(users.count / pageLimit)

    let totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    )
    let prev = page - 1 < 1 ? 1 : page - 1
    let next = page + 1 > pages ? pages : page + 1
    return callback({
      users,
      page,
      totalPage,
      prev,
      next
    })
  },

  getUserOrders: async (req, res, callback) => {
    const userOrderResult = await User.findByPk(req.params.id, {
      include: Order
    })
    const users = {
      id: userOrderResult.dataValues.id,
      email: userOrderResult.dataValues.email,
      name: userOrderResult.dataValues.name,
      phone: userOrderResult.dataValues.phone,
      address: userOrderResult.dataValues.address,
      role: userOrderResult.dataValues.role,
      orders: userOrderResult.dataValues.Orders.map(d => ({
        total_price: d.dataValues.total_price,
        payment_status: d.dataValues.payment_status,
        shipping_status: d.dataValues.shipping_status,
        sn: d.dataValues.sn
      }))
    }

    return callback({ users })
  }
}

module.exports = adminService
