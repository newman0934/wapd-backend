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

describe('# User request', () => {
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

      it('should return 請填妥每一個欄位！', done => {
        request(app)
          .post('/api/signin')
          .send({ email: '', password: '' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('請填妥每一個欄位！')
            done()
          })
      })

      it('should return 查無此使用者！', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'test1@example', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('查無此使用者')
            done()
          })
      })

      it('should return 密碼錯誤！', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'test1@example.com', password: '123' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('密碼錯誤')
            done()
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

      it('should return permission denied', done => {
        request(app)
          .get('/api/admins/products')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('permission denied')
            done()
          })
      })

      after(async () => await db.User.destroy({ where: {}, truncate: true }))
    })
  })
  context('Sign-up request', () => {
    describe('if normal user sign up', () => {
      before(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.User.create({
          name: 'Test1',
          email: 'test1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null)
        })
      })

      it('should return 請填妥每一個欄位！', done => {
        request(app)
          .post('/api/signup')
          .send({ email: '', password: '', passwordCheck: '' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('請填妥每一個欄位！')
            done()
          })
      })

      it('should return 請填妥每一個欄位！', done => {
        request(app)
          .post('/api/signup')
          .send({ email: '', password: '', passwordCheck: '' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('請填妥每一個欄位！')
            done()
          })
      })

      it('should return 信箱重複！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'test1@example.com',
            password: '12345678',
            passwordCheck: '12345678'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('信箱重複！')
            done()
          })
      })

      it('should return 兩次密碼輸入不同！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'testㄉ@example.com',
            password: '12345678',
            passwordCheck: '123456'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('兩次密碼輸入不同！')
            done()
          })
      })

      it('should return 成功註冊帳號及登入！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'test2@example.com',
            password: '12345678',
            passwordCheck: '12345678'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('成功註冊帳號及登入！')
            expect(res.body.token).not.to.equal(undefined)
            done()
          })
      })

      after(async () => await db.User.destroy({ where: {}, truncate: true }))
    })
  })
})
