const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const productController = require('../controllers/api/productController')
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController')

router.get('/', (req, res) => res.redirect('/api/products'))
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

router.get('/users/:id/orders', userController.getUserOrders)
router.get('/users/:id/orders/:order_id', userController.getUserOrder)
router.get('/users/:id/wishlist', userController.getUserFavorite)
router.get('/users/:id/cart', userController.getUserCart)

router.get('/admins/products', adminController.getProducts)
router.get('/admins/products/:id', adminController.getProduct)
router.get('/admins/orders', adminController.getOrders)
router.get('/admins/orders/:id', adminController.getOrder)
router.get('/admins/categories', adminController.getCategories)
router.get('/admins/users', adminController.getUsers)
router.get('/admins/users/:id/orders', adminController.getUserOrders)

module.exports = router
