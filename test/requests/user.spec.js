var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should()
var expect = chai.expect

var app = require('../../app')
var helpers = require('../../_helpers')
const db = require('../../models')

describe('# Admin::User request', () => {
  context('go to admin user page', () => {
    describe('if normal user log in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
        await db.User.create({ name: 'User1' })
      })

      it('should return Unauthorized', done => {
        request(app)
          .get('/api/admins/products')
          .expect(401)
          .end(function(err, res) {
            if (err) return done(err)
            done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, truncate: true })
      })
    })

    describe('if admin user log in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        this.getUser = sinon
          .stub(helpers, 'getUser')
          .returns({ id: 1, role: 'admin' })
        await db.User.create({ name: 'User1' })
      })

      it('should see all user list', done => {
        request(app)
          .get('/api/admins/users')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err)
            res.text.should.include('User1')
            done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, truncate: true })
      })
    })
  })
})
