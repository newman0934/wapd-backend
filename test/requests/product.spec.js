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

describe('# Product request', () => {
  context('get request', () => {
    before(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Image.destroy({ where: {}, truncate: true })
      await db.Size.destroy({ where: {}, truncate: true })
      await db.Color.destroy({ where: {}, truncate: true })
      await db.ProductStatus.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Product.bulkCreate([
        {
          id: 1,
          name: 'Product1',
          description: 'Product1 description',
          status: 'on',
          origin_price: 200,
          sell_price: 300,
          CategoryId: 1
        },
        {
          id: 2,
          name: 'Product2',
          description: 'Product2 description',
          status: 'off',
          origin_price: 200,
          sell_price: 300,
          CategoryId: 1
        }
      ])
      await db.Image.bulkCreate([
        { url: 'Product1.jpg', ProductId: 1 },
        { url: 'Product2.jpg', ProductId: 2 }
      ])
      await db.Size.create({
        size: 'S'
      })
      await db.Color.create({
        color: 'blue'
      })
      await db.Category.create({
        category: 'clothes'
      })
      await db.ProductStatus.bulkCreate([
        {
          sales: 1,
          stock: 1,
          ColorId: 1,
          ProductId: 1,
          SizeId: 1
        },
        {
          sales: 1,
          stock: 1,
          ColorId: 1,
          ProductId: 2,
          SizeId: 1
        }
      ])
    })

    context('Sign-in request', () => {
      describe('if normal user signin in', () => {
        before(async () => {
          await db.User.destroy({ where: {}, truncate: true })
          await db.User.create({
            name: 'Test1',
            email: 'test1@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null)
          })
        })
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
      })
    })

    context('getProducts request', () => {
      it('should return only 1 product', done => {
        request(app)
          .get('/api/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.products.length).to.equal(1)
            done()
          })
      })
      it('should return associated data', done => {
        request(app)
          .get('/api/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.products[0].image[0].url).to.equal('Product1.jpg')
            expect(res.body.products[0].size[0]).to.equal('S')
            expect(res.body.products[0].color[0]).to.equal('blue')
            expect(res.body.products[0].sell_price).to.equal(300)
            expect(res.body.products[0].origin_price).to.equal(200)
            done()
          })
      })
    })

    context('getProduct request', () => {
      it('should return a product', done => {
        request(app)
          .get('/api/products/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.product.name).to.equal('Product1')
            expect(res.body.product.description).to.equal(
              'Product1 description'
            )
            done()
          })
      })
      it('should return not on sale', done => {
        request(app)
          .get('/api/products/2')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'this product is currently not sale'
            )
            done()
          })
      })
      it('should return no product found', done => {
        request(app)
          .get('/api/products/3')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('this product does not exist')
            done()
          })
      })
    })

    context('addWishlist request', () => {
      before(async () => {
        await db.Product.create({
          name: 'test1',
          description: 'test1',
          status: 'on'
        })
        await db.Image.create({
          url: '',
          ProductId: 1
        })
        await db.Color.create({
          color: ''
        })
        await db.Size.create({
          size: ''
        })
        await db.ProductStatus.create({
          ProductId: 1,
          ColorId: 1,
          SizeId: 1
        })
      })

      describe('if user add product to favorite', done => {
        it('should return success', done => {
          request(app)
            .post('/api/products/1/wishlist')
            .set('Authorization', 'bearer ' + APItoken)
            .expect(200)
            .end(async function(err, res) {
              expect(res.body.status).to.equal('success')
              done()
            })
        })

        it('should return "already in user\'s favorite list" if user post again', done => {
          request(app)
            .post('/api/products/1/wishlist')
            .set('Authorization', 'bearer ' + APItoken)
            .expect(400)
            .end(async function(err, res) {
              expect(res.body.status).to.equal('error')
              expect(res.body.message).to.equal(
                "already in user's favorite list"
              )
              done()
            })
        })
      })
    })

    context('deleteWishlist request', () => {
      describe('if user delete product from favorite', done => {
        it('should return success', done => {
          request(app)
            .delete('/api/products/1/wishlist')
            .set('Authorization', 'bearer ' + APItoken)
            .expect(200)
            .end(async function(err, res) {
              expect(res.body.status).to.equal('success')
              done()
            })
        })
      })
      after(async () => {
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Favorite.destroy({ where: {}, truncate: true })
        await db.Image.destroy({ where: {}, truncate: true })
        await db.Color.destroy({ where: {}, truncate: true })
        await db.Size.destroy({ where: {}, truncate: true })
        await db.ProductStatus.destroy({ where: {}, truncate: true })
      })
    })

    after(async () => {
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Image.destroy({ where: {}, truncate: true })
      await db.Size.destroy({ where: {}, truncate: true })
      await db.Color.destroy({ where: {}, truncate: true })
      await db.ProductStatus.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
    })
  })
})
