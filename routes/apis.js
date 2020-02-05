const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const productController = require('../controllers/api/productController')
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController')
const categoryController = require('../controllers/api/categoryController')
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController')
const couponController = require('../controllers/api/couponController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role) {
    return next()
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', (req, res) => res.redirect('/api/products'))
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/categories', categoryController.getCategories)
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

router.get('/users/orders', authenticated, userController.getUserOrders)
router.get(
  '/users/orders/:order_id',
  authenticated,
  userController.getUserOrder
)
router.get('/users/wishlist', authenticated, userController.getUserWishlist)

router.get('/users/cart', authenticated, cartController.getUserCart)
router.post(
  '/products/cart',
  upload.array(),
  authenticated,
  cartController.postCart
)
router.put(
  '/users/cart/:item_id',
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
router.get('/users/edit', authenticated, userController.getUserEdit)
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
  upload.array('images'),
  adminController.addProduct
)
router.put(
  '/admins/products/:id',
  authenticated,
  authenticatedAdmin,
  upload.array('images'),
  adminController.putProduct
)
router.delete(
  '/admins/products/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteProduct
)
router.delete(
  '/admins/image/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteImage
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
  upload.array(),
  adminController.putOrder
)

router.delete(
  '/admins/orders/:id/product',
  authenticated,
  authenticatedAdmin,
  adminController.deleteOrderProduct
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
router.get(
  '/admins/coupons',
  authenticated,
  authenticatedAdmin,
  couponController.getCoupons
)
router.post(
  '/admins/coupons',
  authenticated,
  authenticatedAdmin,
  couponController.addCoupon
)
router.delete(
  '/admins/coupons/:id',
  authenticated,
  authenticatedAdmin,
  couponController.deleteCoupon
)

router.post(
  `/orders/checkout`,
  authenticated,
  upload.array(),
  orderController.postCheckout
)
router.get(`/orders/:id/payment`, authenticated, orderController.getPayment)
router.post(`/spgateway/ReturnURL`, orderController.spgatewayCallback)
router.get(
  `/users/paymentcomplete`,
  authenticated,
  orderController.getPaymentComplete
)

router.post(
  `/admins/orders/transition`,
  authenticated,
  authenticatedAdmin,
  orderController.postTransition
)

router.post(`/spgateway/NotifyURL`, orderController.notifyURLCallback)

module.exports = router
