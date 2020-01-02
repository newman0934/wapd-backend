process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))
const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const ProductModel = require('../../models/product')

describe('# Product Model', () => {
  before(done => {
    done()
  })

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()
  checkModelName(Product)('Product')

  context('properties', () => {
    ;['name', 'description', 'status', 'CategoryId'].forEach(
      checkPropertyExists(product)
    )
  })

  context('associations', () => {
    const CartItem = 'CartItem'
    const Category = 'Category'
    const User = 'User'
    const Order = 'Order'
    const Image = 'Image'
    const ProductStatus = 'ProductStatus'
    const OrderItem = 'OrderItem'
    const Favorite = 'Favorite'
    before(() => {
      Product.associate({ CartItem })
      Product.associate({ Category })
      Product.associate({ User })
      Product.associate({ Order })
      Product.associate({ Image })
      Product.associate({ ProductStatus })
    })

    it('should have many cartitems', done => {
      expect(Product.hasMany).to.have.been.calledWith(CartItem)
      done()
    })
    it('should belong to many categories', done => {
      expect(Product.belongsTo).to.have.been.calledWith(Category)
      done()
    })
    it('should belong to many orderitems', done => {
      expect(Product.belongsToMany).to.have.been.calledWith(Order)
      done()
    })
    it('should belong to many favorites', done => {
      expect(Product.belongsToMany).to.have.been.calledWith(User)
      done()
    })
    it('should have many images', done => {
      expect(Product.hasMany).to.have.been.calledWith(Image)
      done()
    })
    it('should have many productstatues', done => {
      expect(Product.hasMany).to.have.been.calledWith(ProductStatus)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Product.create({}).then(product => {
        data = product
        done()
      })
    })
    it('read', done => {
      db.Product.findByPk(data.id).then(product => {
        expect(data.id).to.be.equal(product.id)
        done()
      })
    })
    it('update', done => {
      db.Product.update({}, { where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(product => {
          expect(data.updatedAt).to.be.not.equal(product.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Product.destroy({ where: { id: data.id }, truncate: true }).then(
        () => {
          db.Product.findByPk(data.id).then(product => {
            expect(product).to.be.equal(null)
            done()
          })
        }
      )
    })
  })
})
