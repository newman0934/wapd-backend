const db = require('../models')
const Category = db.Category

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
    await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    return callback({
      status: 'success',
      message: 'category was successfully deleted'
    })
  }
}

module.exports = categoryService
