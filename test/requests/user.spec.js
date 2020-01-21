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
    })
  })
  context('Sign-up request', () => {
    describe('if normal user sign up', () => {
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

      it('should return 密碼長度不足！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'test2@example.com',
            password: '12345',
            passwordCheck: '12345'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('密碼長度不足！')
            done()
          })
      })

      it('should return 密碼不合法，需至少有一小寫字母！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'test2@example.com',
            password: '123456',
            passwordCheck: '123456'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              '密碼不合法，需至少有一小寫字母！'
            )
            done()
          })
      })

      it('should return 信箱重複！', done => {
        request(app)
          .post('/api/signup')
          .send({
            email: 'test1@example.com',
            password: 'a12345678',
            passwordCheck: 'a12345678'
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
            email: 'test1@example.com',
            password: 'a12345678',
            passwordCheck: 'a123456'
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
            password: 'a12345678',
            passwordCheck: 'a12345678'
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
    })
  })

  context('getUserEdit request', () => {
    it('should return success', done => {
      request(app)
        .get('/api/users/edit')
        .set('Authorization', 'bearer ' + APItoken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.user.email).to.equal('test1@example.com')
          done()
        })
    })
  })

  context('putUser request', () => {
    describe('if user edit', () => {
      it('should return must input email!!', done => {
        request(app)
          .put('/api/users/edit')
          .send({
            birthday: '1992-01-01'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('must input email!!')
            done()
          })
      })

      it('should return user not found!!', done => {
        request(app)
          .put('/api/users/edit')
          .send({
            email: 'test1@example.com',
            name: 'test1',
            birthday: '1992-01-01',
            address: 'test address',
            phone: '0912345678'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('user successfully edited')
            done()
          })
      })
    })
  })

  context('postPasswordChange request', () => {
    describe('if user change password', () => {
      it('should return old password does not match!!', done => {
        request(app)
          .post('/api/users/password_change')
          .send({
            usedPassword: '123456'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('old password does not match!!')
            done()
          })
      })
      it('should return old password does not match!!', done => {
        request(app)
          .post('/api/users/password_change')
          .send({
            usedPassword: '12345678',
            newPassword: '123456',
            passwordCheck: '2345678'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('new passwords does not match!!')
            done()
          })
      })
      it('should return password successfully changed', done => {
        request(app)
          .post('/api/users/password_change')
          .send({
            usedPassword: '12345678',
            newPassword: '123456',
            passwordCheck: '123456'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('password successfully changed')
            done()
          })
      })
    })
  })

  context('postPasswordForget request', () => {
    describe('if user change password', () => {
      it('should return This email is not registered yet!!', done => {
        request(app)
          .post('/api/users/password_forget')
          .send({
            email: 'test@123.com'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'This email is not registered yet!!'
            )
            done()
          })
      })
      it('should return email successfully sent to user', done => {
        request(app)
          .post('/api/users/password_forget')
          .send({
            email: 'test1@example.com'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('email successfully sent to user')
            done()
          })
      })
    })
  })

  context('getPasswordReset request', () => {
    describe('if user reset password', () => {
      before(async () => {
        await db.Token.destroy({ where: {}, truncate: true })
        await db.Token.create({
          token: 'abcd1234',
          UserId: 1,
          isUsed: false
        })
      })
      it('should return No valid token found!!', done => {
        request(app)
          .get('/api/users/password_reset/1/1234abcd')
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('No valid token found!!')
            done()
          })
      })
      it('should return No valid token found!!', done => {
        request(app)
          .get('/api/users/password_reset/2/abcd1234')
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('No valid token found!!')
            done()
          })
      })
      it('should return token is valid!!', done => {
        request(app)
          .get('/api/users/password_reset/1/abcd1234')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('token is valid!!')
            done()
          })
      })
    })
  })

  context('postPasswordReset request', () => {
    describe('if user post reset password', () => {
      it('should return passwords are different!!', done => {
        request(app)
          .post('/api/users/password_reset')
          .send({
            password: '12345678',
            passwordCheck: '123456',
            token: 'abcd1234',
            email: 'test1@example.com'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('passwords are different!!')
            done()
          })
      })
      it('should return no token found!!', done => {
        request(app)
          .post('/api/users/password_reset')
          .send({
            password: '12345678',
            passwordCheck: '12345678',
            token: 'abcd123456',
            userId: 1
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('no token found!!')
            done()
          })
      })
      it('should return no token found!!', done => {
        request(app)
          .post('/api/users/password_reset')
          .send({
            password: '12345678',
            passwordCheck: '12345678',
            token: 'abcd1234',
            userId: 3
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('no token found!!')
            done()
          })
      })

      it('should return user password reset successfully!!', done => {
        request(app)
          .post('/api/users/password_reset')
          .send({
            password: '12345678',
            passwordCheck: '12345678',
            token: 'abcd1234',
            userId: 1
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'user password reset successfully!!'
            )
            done()
          })
      })
    })
  })

  context('getUserFavorite request', () => {
    before(async () => {
      await db.Product.create({
        name: 'test1',
        description: 'test1',
        status: 'on'
      })
      await db.Favorite.create({
        UserId: 1,
        ProductId: 1
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

    describe('if user sees self favorite products', done => {
      it('should return a json data', done => {
        request(app)
          .get('/api/users/wishlist')
          .set('Authorization', 'bearer ' + APItoken)
          .expect(200)
          .end(async function(err, res) {
            expect(res.body.products[0].name).to.equal('test1')
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

  context('getUserOrders request', () => {
    before(async () => {
      await db.Product.bulkCreate([
        {
          name: 'test1',
          description: 'test1',
          status: 'on'
        },
        {
          name: 'test2',
          description: 'test2',
          status: 'on'
        }
      ])
      await db.Order.create({
        UserId: 1
      })
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

    describe('if user look for self orders', done => {
      it('should return success', done => {
        request(app)
          .get('/api/users/orders')
          .set('Authorization', 'bearer ' + APItoken)
          .expect(200)
          .end(async function(err, res) {
            expect(res.body.orders[0].OrderItems.length).to.equal(2)
            done()
          })
      })
    })

    context('getUserOrders request', () => {
      describe('if user look for self order', done => {
        it('should return success', done => {
          request(app)
            .get('/api/users/orders/1')
            .set('Authorization', 'bearer ' + APItoken)
            .expect(200)
            .end(async function(err, res) {
              expect(res.body.orders.items.length).to.equal(2)
              done()
            })
        })
      })

      after(async () => {
        await db.User.destroy({ where: {}, truncate: true })
        await db.Token.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })
      })
    })
  })
})
