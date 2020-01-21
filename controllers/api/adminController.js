const adminService = require('../../services/adminService')

const adminController = {
  getProducts: (req, res) => {
    adminService.getProducts(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getProduct: (req, res) => {
    adminService.getProduct(req, res, data => {
      return res.status(200).json(data)
    })
  },

  addProduct: (req, res) => {
    adminService.addProduct(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  deleteProduct: (req, res) => {
    adminService.deleteProduct(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  deleteImage: (req, res) => {
    adminService.deleteImage(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  putProduct: (req, res) => {
    adminService.putProduct(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  getProductStocks: (req, res) => {
    adminService.getProductStocks(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getProductStockEdit: (req, res) => {
    adminService.getProductStockEdit(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  putProductStockProps: (req, res) => {
    adminService.putProductStockProps(req, res, data => {
      return res.status(200).json(data)
    })
  },

  addProductStockProps: (req, res) => {
    adminService.addProductStockProps(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  deleteProductStockProp: (req, res) => {
    adminService.deleteProductStockProp(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  getOrders: (req, res) => {
    adminService.getOrders(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getOrder: (req, res) => {
    adminService.getOrder(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  putOrder: (req, res) => {
    adminService.putOrder(req, res, data => {
      return res.status(200).json(data)
    })
  },

  deleteOrderProduct: (req, res) => {
    adminService.deleteOrderProduct(req, res, data => {
      if (data.status === 'error') {
        return res.status(400).json(data)
      }
      return res.status(200).json(data)
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.status(200).json(data)
    })
  },

  getUserOrders: (req, res) => {
    adminService.getUserOrders(req, res, data => {
      return res.status(200).json(data)
    })
  }
}

module.exports = adminController
