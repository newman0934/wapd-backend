const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const productController = require('../controllers/api/productController')
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController')
const categoryController = require('../controllers/api/categoryController')
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role) {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', (req, res) => res.redirect('/api/products'))
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
router.post(
  '/products/:id/wishlist',
  authenticated,
  productController.addWishlist
)
router.delete(
  '/products/:id/wishlist',
  authenticated,
  productController.deleteWishlist
)

router.get('/users/:id/orders', userController.getUserOrders)
router.get('/users/:id/orders/:order_id', userController.getUserOrder)
router.get('/users/:id/wishlist', authenticated, userController.getUserWishlist)

router.get('/users/:id/cart', authenticated, cartController.getUserCart)
router.post(
  '/products/cart',
  upload.array(),
  authenticated,
  cartController.postCart
)
router.put(
  '/users/:id/cart/:item_id',
  authenticated,
  upload.array(),
  cartController.putCartQuantity
)
router.post(
  '/products/notLoginCart',
  upload.array(),
  cartController.notLoginPostCart
)
router.delete(
  '/users/cart/:id',
  authenticated,
  cartController.deleteCartProduct
)

router.post('/users/orders', authenticated, orderController.postOrder)

router.get(
  '/users/password_change',
  authenticated,
  userController.getPasswordChange
)
router.post(
  '/users/password_change',
  authenticated,
  userController.postPasswordChange
)
router.post('/users/password_forget', userController.postPasswordForget)
router.get(
  '/users/password_reset/:token_id/:token',
  userController.getPasswordReset
)
router.post('/users/password_reset', userController.postPasswordReset)
router.get('/users/:id/edit', authenticated, userController.getUserEdit)
router.put('/users/edit', authenticated, userController.putUser)

router.get('/orders/:id/checkout', authenticated, orderController.getCheckout)
router.post('/coupon', orderController.postCoupon)

router.get(
  '/admins/products',
  authenticated,
  authenticatedAdmin,
  adminController.getProducts
)
router.get(
  '/admins/products/:id',
  authenticated,
  authenticatedAdmin,
  adminController.getProduct
)
router.post(
  '/admins/products',
  authenticated,
  authenticatedAdmin,
  upload.array('image'),
  adminController.addProduct
)
router.put(
  '/admins/products/:id',
  authenticated,
  authenticatedAdmin,
  adminController.putProduct
)
router.delete(
  '/admins/products/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteProduct
)

router.get(
  '/admins/products/:id/stocks',
  authenticated,
  authenticatedAdmin,
  adminController.getProductStocks
)
router.get(
  '/admins/products/:id/stocks/:stock_id',
  authenticated,
  authenticatedAdmin,
  adminController.getProductStockEdit
)
router.put(
  '/admins/products/:id/stocks/:stock_id',
  authenticated,
  authenticatedAdmin,
  adminController.putProductStockProps
)
router.post(
  '/admins/products/:id/stocks/',
  authenticated,
  authenticatedAdmin,
  adminController.addProductStockProps
)
router.delete(
  '/admins/products/:id/stocks/:stock_id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteProductStockProp
)

router.get(
  '/admins/orders',
  authenticated,
  authenticatedAdmin,
  adminController.getOrders
)
router.get(
  '/admins/orders/:id',
  authenticated,
  authenticatedAdmin,
  adminController.getOrder
)
router.put(
  '/admins/orders/:id',
  authenticated,
  authenticatedAdmin,
  adminController.putOrder
)

router.get(
  '/admins/categories',
  authenticated,
  authenticatedAdmin,
  categoryController.getCategories
)
router.post(
  '/admins/categories/',
  authenticated,
  authenticatedAdmin,
  categoryController.addCategory
)
router.put(
  '/admins/categories/:id',
  authenticated,
  authenticatedAdmin,
  categoryController.putCategory
)
router.delete(
  '/admins/categories/:id',
  authenticated,
  authenticatedAdmin,
  categoryController.deleteCategory
)

router.get(
  '/admins/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
)
router.get(
  '/admins/users/:id/orders',
  authenticated,
  authenticatedAdmin,
  adminController.getUserOrders
)

router.post(
  `/orders/checkout`,
  authenticated,
  upload.array(),
  orderController.postCheckout
)
router.get(`/orders/:id/payment`, authenticated, orderController.getPayment)
router.post(`/spgateway/callback`, orderController.spgatewayCallback)
router.get(
  `/users/:id/paymentcomplete`,
  authenticated,
  orderController.getPaymentComplete
)

module.exports = router
