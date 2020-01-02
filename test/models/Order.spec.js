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
const OrderModel = require('../../models/order')

describe('# Order Model', () => {
  before(done => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()
  checkModelName(Order)('Order')

  context('properties', () => {
    ;[
      'total_price',
      'shipping_status',
      'payment_status',
      'UserId',
      'phone',
      'payment_method',
      'address',
      'receiver_name',
      'email',
      'comment',
      'sn'
    ].forEach(checkPropertyExists(order))
  })

  context('associations', () => {
    const OrderItem = 'OrderItem'
    const Product = 'Product'
    const Payment = 'Payment'
    const Coupon = 'Coupon'
    const User = 'User'
    before(() => {
      Order.associate({ Product })
      Order.associate({ Payment })
      Order.associate({ Coupon })
      Order.associate({ User })
    })

    it('should have many coupons', done => {
      expect(Order.belongsTo).to.have.been.calledWith(Coupon)
      done()
    })
    it('should have many payments', done => {
      expect(Order.hasMany).to.have.been.calledWith(Payment)
      done()
    })
    it('should have many orderitems', done => {
      expect(Order.belongsToMany).to.have.been.calledWith(Product)
      done()
    })
    it('should belong to many users', done => {
      expect(Order.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Order.create({}).then(order => {
        data = order
        done()
      })
    })
    it('read', done => {
      db.Order.findByPk(data.id).then(order => {
        expect(data.id).to.be.equal(order.id)
        done()
      })
    })
    it('update', done => {
      db.Order.update({}, { where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then(order => {
          expect(data.updatedAt).to.be.not.equal(order.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Order.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Order.findByPk(data.id).then(order => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })
})
