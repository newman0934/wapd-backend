process.env.NODE_ENV = 'test'

const chai = require('chai')
let request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const expect = chai.expect
const bcrypt = require('bcryptjs')

const app = require('../../app')
const helpers = require('../../_helpers')
const db = require('../../models')
const ordersChecker = require('../../utils/ordersChecker')
const cryptoHelpers = require('../../utils/cryptoHelpers')

describe('# Utils request', () => {
  context('# ordersChecker request', () => {
    describe('# When ordersChecker is running', () => {
      before(async () => {
        await db.Order.bulkCreate([
          {
            payment_status: null,
            createdAt: '2020-01-01 00:00:00'
          },
          {
            payment_status: 1
          }
        ])
      })
      it("should set order 1's payment_status to 99", async () => {
        await ordersChecker([0, 0, 1], 7200000)
        setTimeout(async () => {
          const order = await db.Order.findAll({
            where: { payment_status: 99 }
          })
          expect(order.length).to.equal(1)
        }, 1000)
      })
      after(async () => {
        await db.Order.destroy({ where: {}, truncate: true })
      })
    })
  })

  context('# cryptoHelpers request', () => {
    let data = ''
    let transitionValue = ''
    describe('when user is going through spgateway', () => {
      it('should return an object', () => {
        data = cryptoHelpers.getTradeInfo(100, 'Desc', 'Email', 0, 0, 0, 0)
        expect(data.TradeInfo).not.equal('')
        expect(data.TradeInfo).not.equal(undefined)
      })
    })

    describe('when admin is checking transition data', () => {
      it('should return an object', () => {
        transitionValue = cryptoHelpers.getTransitionCheckValue(
          100,
          'MerchantOrderNo'
        )
        expect(transitionValue).not.equal('')
        expect(transitionValue).not.equal(undefined)
      })
    })

    describe('when server is decrypting data', () => {
      it('should contains merchantID', () => {
        const result = cryptoHelpers.create_mpg_aes_decrypt(data.TradeInfo)
        expect(result).to.include(`MerchantID=${process.env.MERCHANT_ID}`)
      })
    })
  })
})
