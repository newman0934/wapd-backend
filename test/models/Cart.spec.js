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
const CartModel = require('../../models/cart')

describe('# Cart Model', () => {
  before(done => {
    done()
  })

  const Cart = CartModel(sequelize, dataTypes)
  const cart = new Cart()
  checkModelName(Cart)('Cart')

  context('associations', () => {
    const CartItem = 'CartItem'
    before(() => {
      Cart.associate({ CartItem })
    })

    it('should have many cartitems', done => {
      expect(Cart.hasMany).to.have.been.calledWith(CartItem)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Cart.create({}).then(cart => {
        data = cart
        done()
      })
    })
    it('read', done => {
      db.Cart.findByPk(data.id).then(cart => {
        expect(data.id).to.be.equal(cart.id)
        done()
      })
    })
    it('update', done => {
      db.Cart.update({}, { where: { id: data.id } }).then(() => {
        db.Cart.findByPk(data.id).then(cart => {
          expect(data.updatedAt).to.be.not.equal(cart.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Cart.destroy({ where: { id: data.id } }).then(() => {
        db.Cart.findByPk(data.id).then(cart => {
          expect(cart).to.be.equal(null)
          done()
        })
      })
    })
  })
})
