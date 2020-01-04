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
const CouponModel = require('../../models/coupon')

describe('# Coupon Model', () => {
  before(done => {
    done()
  })

  const Coupon = CouponModel(sequelize, dataTypes)
  const coupon = new Coupon()
  checkModelName(Coupon)('Coupon')

  context('properties', () => {
    ;['coupon_code', 'discount_amount'].forEach(checkPropertyExists(coupon))
  })

  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Coupon.associate({ Order })
    })

    it('should belong to orders', done => {
      expect(Coupon.hasMany).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Coupon.create({}).then(coupon => {
        data = coupon
        done()
      })
    })
    it('read', done => {
      db.Coupon.findByPk(data.id).then(coupon => {
        expect(data.id).to.be.equal(coupon.id)
        done()
      })
    })
    it('update', done => {
      db.Coupon.update({}, { where: { id: data.id } }).then(() => {
        db.Coupon.findByPk(data.id).then(coupon => {
          expect(data.updatedAt).to.be.not.equal(coupon.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Coupon.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Coupon.findByPk(data.id).then(coupon => {
          expect(coupon).to.be.equal(null)
          done()
        })
      })
    })
  })
})
