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

describe('# Order request', () => {
  before(async () => {
    await db.User.create({
      name: 'Test1',
      email: 'test1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null)
    })
    await db.Order.create({
      UserId: 1
    })
    await db.Product.bulkCreate([
      {
        name: 'product1',
        description: 'product1 des'
      },
      {
        name: 'product2',
        description: 'product2 des'
      }
    ])
    await db.Image.bulkCreate([
      {
        url: '',
        ProductId: 1
      },
      {
        url: '',
        ProductId: 2
      }
    ])
    await db.OrderItem.bulkCreate([
      {
        OrderId: 1,
        ProductId: 1
      },
      {
        OrderId: 1,
        ProductId: 2
      }
    ])
  })
  context('getUserOrders request', () => {
    it('should log in success', done => {
      request(app)
        .post('/api/signin')
        .send({ email: 'test1@example.com', password: '12345678' })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          APItoken = res.body.token
          expect(res.body.status).to.equal('success')
          expect(res.body.message).to.equal('ok')
          done()
        })
    })
    it('should return order does not exist!! if :id is wrong', done => {
      request(app)
        .get('/api/orders/99/checkout')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('order does not exist!!')
          done()
        })
    })
    it('should return a json data', done => {
      request(app)
        .get('/api/orders/1/checkout')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.orderItems.length).to.equal(2)
          done()
        })
    })
  })
  after(async () => {
    await db.User.destroy({ where: {}, truncate: true })
  })
})
