const productService = require('../../services/productService')

const productController = {
  /**
   * @swagger
   * /api/products:
   *    get:
   *      description: This should return status-on products
   *      responses:
   *         200:
   *           description: An array of products
   */
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      return res.status(200).json(data)
    })
  },
  /**
   * @swagger
   * /api/products/{id}:
   *    get:
   *      description: Find status-on Product by ID
   *      operationId: getProductById
   *      parameters:
   *      - in: path
   *        name: id
   *        description: return a status-on product with images, size, color and categories
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *      security:
   *        - bearerAuth: []
   *      responses:
   *         200:
   *           description: a product found by id
   */
  getProduct: (req, res) => {
    productService.getProduct(req, res, data => {
      return res.status(200).json(data)
    })
  },

  addWishlist: (req, res) => {
    productService.addWishlist(req, res, data => {
      return res.json(data)
    })
  },

  deleteWishlist: (req, res) => {
    productService.deleteWishlist(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = productController
