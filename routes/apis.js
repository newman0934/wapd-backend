const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const productController = require('../controllers/api/productController')

router.get('/', productController.getProducts)

module.exports = router
