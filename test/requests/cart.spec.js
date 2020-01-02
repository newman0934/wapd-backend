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

let APItoken = ''

describe('# Cart request', () => {
  context('notLoginPostCart request', () => {
    before(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Product.create({
        name: 'product test1',
        description: 'product1 description',
        status: 'on',
        cost: 100,
        origin_price: 200,
        sell_price: 300
      })
    })
    describe('if not-login user add product to cart', () => {
      it('should return item successfully added into cart', done => {
        request(app)
          .post('/api/products/notLoginCart')
          .send({
            productId: 1,
            size: 'S',
            color: 'Red',
            quantity: 1
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'item successfully added into cart'
            )
            done()
          })
      })
    })
    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
    })
  })
})
