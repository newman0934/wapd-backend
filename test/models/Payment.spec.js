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
const PaymentModel = require('../../models/payment')

describe('# Payment Model', () => {
  before(done => {
    done()
  })

  const Payment = PaymentModel(sequelize, dataTypes)
  const payment = new Payment()
  checkModelName(Payment)('Payment')

  context('properties', () => {
    ;['sn', 'amount', 'payment_method', 'payment_status', 'paid_at'].forEach(
      checkPropertyExists(payment)
    )
  })

  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Payment.associate({ Order })
    })

    it('should belong to orders', done => {
      expect(Payment.belongsTo).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Payment.create({}).then(payment => {
        data = payment
        done()
      })
    })
    it('read', done => {
      db.Payment.findByPk(data.id).then(payment => {
        expect(data.id).to.be.equal(payment.id)
        done()
      })
    })
    it('update', done => {
      db.Payment.update({}, { where: { id: data.id } }).then(() => {
        db.Payment.findByPk(data.id).then(payment => {
          expect(data.updatedAt).to.be.not.equal(payment.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Payment.destroy({ where: { id: data.id }, truncate: true }).then(
        () => {
          db.Payment.findByPk(data.id).then(payment => {
            expect(payment).to.be.equal(null)
            done()
          })
        }
      )
    })
  })
})
