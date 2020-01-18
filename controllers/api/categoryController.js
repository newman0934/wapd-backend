const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.status(200).json(data)
    })
  },
  addCategory: (req, res) => {
    categoryService.addCategory(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  }
}

module.exports = categoryController
