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
const CartItemModel = require('../../models/cartitem')

describe('# CartItem Model', () => {
  before(done => {
    done()
  })

  const CartItem = CartItemModel(sequelize, dataTypes)
  const cartitem = new CartItem()
  checkModelName(CartItem)('CartItem')

  context('properties', () => {
    ;['stock', 'quantity', 'UserId', 'ProductId', 'color', 'size'].forEach(
      checkPropertyExists(cartitem)
    )
  })

  context('associations', () => {
    const Product = 'Product'
    const User = 'User'
    before(() => {
      CartItem.associate({ Product })
      CartItem.associate({ User })
    })

    it('should belong to many products', done => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Product)
      done()
    })
    it('should belong to many users', done => {
      expect(CartItem.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.CartItem.create({}).then(cartitem => {
        data = cartitem
        done()
      })
    })
    it('read', done => {
      db.CartItem.findByPk(data.id).then(cartitem => {
        expect(data.id).to.be.equal(cartitem.id)
        done()
      })
    })
    it('update', done => {
      db.CartItem.update({}, { where: { id: data.id } }).then(() => {
        db.CartItem.findByPk(data.id).then(cartitem => {
          expect(data.updatedAt).to.be.not.equal(cartitem.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.CartItem.destroy({ where: { id: data.id }, truncate: true }).then(
        () => {
          db.CartItem.findByPk(data.id).then(cartitem => {
            expect(cartitem).to.be.equal(null)
            done()
          })
        }
      )
    })
  })
})
