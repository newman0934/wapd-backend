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

describe('# Category request', () => {
  before(async () => {
    await db.User.create({
      name: 'Admin1',
      email: 'admin1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin'
    })
    await db.Coupon.create({
      coupon_code: 'coupon1'
    })
  })
  context('getCoupons request', done => {
    describe('getting categories', done => {
      it('should log in success', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'admin1@example.com', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            APItoken = res.body.token
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('ok')
            done()
          })
      })
      it('should return a json data', done => {
        request(app)
          .get('/api/admins/coupons')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.coupons.length).to.equal(1)
            expect(res.body.coupons[0].id).to.equal(1)
            done()
          })
      })
    })
    describe('adding a category', done => {
      it('should return "must input every column" if post empty column', done => {
        request(app)
          .post('/api/admins/coupons')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('must input every column')
            done()
          })
      })
      it('should return "discountAmount must be an integer" if discountAmount is not an integer', done => {
        request(app)
          .post('/api/admins/coupons')
          .send({ couponCode: 'coupon', discountAmount: 'abc' })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'discountAmount must be an integer'
            )
            done()
          })
      })
      it('should return "coupon code already exist" if user post an existed coupon code', done => {
        request(app)
          .post('/api/admins/coupons')
          .send({ couponCode: 'coupon1', discountAmount: 100 })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('coupon code already exist')
            done()
          })
      })
      it('should return create a new coupon', done => {
        request(app)
          .post('/api/admins/coupons')
          .send({ couponCode: 'coupon2', discountAmount: 100 })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const coupons = await db.Coupon.findAll({})
            expect(coupons.length).to.equal(2)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('coupon is successfully created')
            done()
          })
      })
      describe('adding a category', done => {
        it('should delete an existing coupon', done => {
          request(app)
            .delete('/api/admins/coupons/1')
            .set('Authorization', 'bearer ' + APItoken)
            .set('Accept', 'application/json')
            .expect(200)
            .end(async (err, res) => {
              const coupons = await db.Coupon.findAll({})
              expect(coupons.length).to.equal(1)
              expect(res.body.status).to.equal('success')
              expect(res.body.message).to.equal(
                'coupon is successfully deleted'
              )
              done()
            })
        })
      })
    })
  })

  after(async () => {
    await db.User.destroy({ where: {}, truncate: true })
    await db.Coupon.destroy({ where: {}, truncate: true })
  })
})
