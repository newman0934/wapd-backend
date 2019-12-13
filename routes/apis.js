const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const productController = require('../controllers/api/productController')
const adminController = require('../controllers/api/adminController')

router.get('/', (req, res) => res.redirect('/api/products'))
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

router.get('/admins/products', adminController.getProducts)
router.get('/admins/products/:id', adminController.getProduct)

module.exports = router
