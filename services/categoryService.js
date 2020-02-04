const db = require('../models')
const { Category, Product } = db

const categoryService = {
  getCategories: async (req, res, callback) => {
    const categories = await Category.findAll()
    return callback({ categories })
  },
  addCategory: async (req, res, callback) => {
    if (!req.body.category) {
      return callback({
        status: 'error',
        message: "category name didn't exist"
      })
    } else {
      await Category.create({ category: req.body.category })
      return callback({
        status: 'success',
        message: 'category was successfully created'
      })
    }
  },
  putCategory: async (req, res, callback) => {
    if (!req.body.category) {
      return callback({
        status: 'error',
        message: "category name didn't exist"
      })
    } else {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      return callback({
        status: 'success',
        message: 'category was successfully updated'
      })
    }
  },
  deleteCategory: async (req, res, callback) => {
    const category = await Category.findByPk(req.params.id, {
      include: Product
    })
    if (category.Products.length) {
      return callback({
        status: 'error',
        message: 'can not be deleted unless no products are associated!!'
      })
    }
    await category.destroy()
    return callback({
      status: 'success',
      message: 'category was successfully deleted'
    })
  }
}

module.exports = categoryService
