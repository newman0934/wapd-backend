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
  before(async () => {
    await db.CartItem.destroy({ where: {}, truncate: true })
    await db.User.destroy({ where: {}, truncate: true })
    await db.Product.destroy({ where: {}, truncate: true })
    await db.Product.bulkCreate([
      {
        name: 'product test1',
        description: 'product1 description',
        status: 'on',
        origin_price: 200,
        sell_price: 300
      },
      {
        name: 'product test2',
        description: 'product2 description',
        status: 'on',
        origin_price: 200,
        sell_price: 300
      }
    ])
    await db.User.create({
      name: 'Test1',
      email: 'test1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null)
    })
  })
  context('notLoginPostCart request', () => {
    describe('if not-login user add product to cart', () => {
      it('should return quantity must be greater than 0!!', done => {
        request(app)
          .post('/api/products/notLoginCart')
          .send({
            productId: 1,
            size: 'S',
            color: 'Red',
            quantity: -1
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'quantity must be greater than 0!!'
            )
            done()
          })
      })
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
            expect(res.body.tempCartItems.length).to.equal(1)
            expect(res.body.tempCartItems[0].UserId).to.equal(null)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'item successfully added into cart'
            )
            done()
          })
      })
    })
  })
  context('postCart request', () => {
    before(async () => {
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
    describe('if login user add product to cart', done => {
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
      it('should return "quantity must be greater than 0!!" if user use devtool or postman to change quantity', done => {
        request(app)
          .post('/api/products/cart')
          .set('Authorization', 'bearer ' + APItoken)
          .send({
            productId: 1,
            size: 'S',
            color: 'Red',
            quantity: -1
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'quantity must be greater than 0!!'
            )
            done()
          })
      })
      it('should return "please fill every column!!" if user didn\'t fill any column', done => {
        request(app)
          .post('/api/products/cart')
          .set('Authorization', 'bearer ' + APItoken)
          .send({
            productId: 1,
            size: 'S',
            color: 'Red'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('please fill every column!!')
            done()
          })
      })
      it('should return item successfully added into cart', done => {
        request(app)
          .post('/api/products/cart')
          .set('Authorization', 'bearer ' + APItoken)
          .send({
            productId: 1,
            size: 'S',
            color: 'Red',
            quantity: 1
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const cartItem = await db.CartItem.findAll()
            expect(cartItem.length).to.not.equal(0)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'item successfully added into cart'
            )
            done()
          })
      })
      it('should return quantity of 2', done => {
        request(app)
          .post('/api/products/cart')
          .set('Authorization', 'bearer ' + APItoken)
          .send({
            productId: 1,
            size: 'S',
            color: 'Red',
            quantity: 2
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const cartItem = await db.CartItem.findAll()
            expect(cartItem[0].quantity).to.equal(3)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'item successfully added into cart'
            )
            done()
          })
      })
      it('should return 2 cartItems', done => {
        request(app)
          .post('/api/products/cart')
          .set('Authorization', 'bearer ' + APItoken)
          .send({
            productId: 2,
            size: 'S',
            color: 'Red',
            quantity: 1
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const cartItem = await db.CartItem.findAll()
            expect(cartItem.length).to.equal(2)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'item successfully added into cart'
            )
            done()
          })
      })
      after(async () => {
        await db.CartItem.destroy({ where: {}, truncate: true })
      })
    })
  })
  context('getUserCart request', () => {
    before(async () => {
      await db.CartItem.create({
        quantity: 1,
        color: 'Red',
        size: 'S',
        ProductId: 1,
        UserId: 1
      })
      const user = await db.User.findAll({ include: db.CartItem })
    })
    it("should return user's cart", done => {
      request(app)
        .get('/api/users/cart')
        .set('Authorization', 'bearer ' + APItoken)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.userCart.cartItem[0].name).to.equal('product test1')
          expect(res.body.userCart.email).to.equal('test1@example.com')
          done()
        })
    })
    after(async () => {
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })
  context('putCartQuantity request', () => {
    describe('when user is editing quantity of cart items', () => {
      before(async () => {
        await db.CartItem.create({
          quantity: 1,
          color: 'Red',
          size: 'S',
          ProductId: 1,
          UserId: 1
        })
        const user = await db.User.findAll({ include: db.CartItem })
      })
      it("should return 'no matched cartItem found!!' if :item_id is wrong", done => {
        request(app)
          .put('/api/users/cart/99')
          .send({
            quantity: 2
          })
          .set('Authorization', 'bearer ' + APItoken)
          .expect(400)
          .end(function(err, res) {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('no matched cartItem found!!')
            done()
          })
      })
      it("should return 'please write quantity!!' if no quantity is sent", done => {
        request(app)
          .put('/api/users/cart/1')
          .send({})
          .set('Authorization', 'bearer ' + APItoken)
          .expect(400)
          .end(function(err, res) {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('please write quantity!!')
            done()
          })
      })
      it("should return 'please write quantity!!' if no quantity is sent", done => {
        request(app)
          .put('/api/users/cart/1')
          .send({ quantity: -2 })
          .set('Authorization', 'bearer ' + APItoken)
          .expect(400)
          .end(function(err, res) {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'quantity must be greater than 0!!'
            )
            done()
          })
      })
      it('should return cartItem updated successful!!', done => {
        request(app)
          .put('/api/users/cart/1')
          .send({
            quantity: 2
          })
          .set('Authorization', 'bearer ' + APItoken)
          .expect(200)
          .end(function(err, res) {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('cartItem updated successful!!')
            done()
          })
      })
      after(async () => {
        await db.CartItem.destroy({ where: {}, truncate: true })
      })
    })
  })
  context('deleteCartProduct request', () => {
    before(async () => {
      await db.CartItem.create({
        quantity: 1,
        color: 'Red',
        size: 'S',
        ProductId: 1,
        UserId: 1
      })
    })
    describe('if user deletes an item in cart', done => {
      it("should return 'item deleted failed!!item not found' if wrong id", done => {
        request(app)
          .delete('/api/users/cart/99')
          .set('Authorization', 'bearer ' + APItoken)
          .expect(400)
          .end(function(err, res) {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'item deleted failed!!item not found'
            )
            done()
          })
      })
      it("should return 'item is successfully deleted'", done => {
        request(app)
          .delete('/api/users/cart/1')
          .set('Authorization', 'bearer ' + APItoken)
          .expect(200)
          .end(function(err, res) {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('item is successfully deleted')
            done()
          })
      })
    })
    after(async () => {
      await db.CartItem.destroy({ where: {}, truncate: true })
    })
  })
})
after(async () => {
  await db.Product.destroy({ where: {}, truncate: true })
  await db.CartItem.destroy({ where: {}, truncate: true })
  await db.User.destroy({ where: {}, truncate: true })
})
