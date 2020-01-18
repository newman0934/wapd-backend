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
    await db.Category.create({
      category: 'cat1'
    })
  })
  context('getCategories request', done => {
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
          .get('/api/admins/categories')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.categories.length).to.equal(1)
            expect(res.body.categories[0].category).to.equal('cat1')
            done()
          })
      })
    })
  })

  context('addCategory request', done => {
    describe('adding a new category', done => {
      it("should return category name didn't exist if user didn't send data", done => {
        request(app)
          .post('/api/admins/categories')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal("category name didn't exist")
            done()
          })
      })
      it('should add a new category', done => {
        request(app)
          .post('/api/admins/categories')
          .send({ category: 'cat2' })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const categories = await db.Category.findAll({})
            expect(categories.length).to.equal(2)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'category was successfully created'
            )
            done()
          })
      })
    })
  })

  context('putCategory request', done => {
    describe('editing a new category', done => {
      it("should return category name didn't exist if user didn't send data", done => {
        request(app)
          .put('/api/admins/categories/1')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal("category name didn't exist")
            done()
          })
      })
      it('should edit category', done => {
        request(app)
          .put('/api/admins/categories/2')
          .send({ category: 'cat2000' })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const categories = await db.Category.findAll({})
            expect(categories[1].category).to.equal('cat2000')
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'category was successfully updated'
            )
            done()
          })
      })
    })
  })

  context('deleteCategory request', done => {
    describe('deleting an existed category', done => {
      before(async () => {
        await db.Product.create({ CategoryId: 1 })
      })
      it('should reject if a product is associated', done => {
        request(app)
          .delete('/api/admins/categories/1')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'can not be deleted unless no products are associated!!'
            )
            done()
          })
      })
      afterEach(async () => {
        await db.Product.destroy({ where: {}, truncate: true })
      })
      it('should successfully delete category', done => {
        request(app)
          .delete('/api/admins/categories/1')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            const categories = await db.Category.findAll({})
            expect(categories.length).to.equal(1)
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'category was successfully deleted'
            )
            done()
          })
      })
    })
  })

  after(async () => {
    await db.User.destroy({ where: {}, truncate: true })
    await db.Category.destroy({ where: {}, truncate: true })
    await db.Product.destroy({ where: {}, truncate: true })
  })
})
