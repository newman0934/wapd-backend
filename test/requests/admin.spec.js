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
describe('# Admin request', () => {
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
    await db.Product.bulkCreate([
      {
        name: 'product1',
        description: 'product1 des',
        CategoryId: 1
      },
      {
        name: 'product2',
        description: 'product2 des',
        CategoryId: 1
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
    await db.ProductStatus.bulkCreate([
      {
        ProductId: 1,
        stock: 2,
        SizeId: 1,
        ColorId: 1
      },
      {
        ProductId: 2,
        stock: 4,
        SizeId: 1,
        ColorId: 1
      }
    ])
    await db.Size.create({
      size: 'S'
    })
    await db.Color.create({
      color: 'red'
    })
  })
  context('getProducts request', () => {
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
    it('should return json data', done => {
      request(app)
        .get('/api/admins/products')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.products.length).to.equal(2)
          expect(res.body.products[0].name).to.equal('product1')
          done()
        })
    })
  })

  context('getProduct request', () => {
    it('should return json data', done => {
      request(app)
        .get('/api/admins/products/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.product.name).to.equal('product1')
          done()
        })
    })
  })

  context('getProductStocks request', () => {
    it('should return json data', done => {
      request(app)
        .get('/api/admins/products/1/stocks')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.productStatus.length).to.equal(1)
          expect(res.body.productStatus[0].stock).to.equal(2)
          done()
        })
    })
  })

  context('getProductStockEdit request', () => {
    it('should return json data', done => {
      request(app)
        .get('/api/admins/products/1/stocks/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.productStatus.stock).to.equal(2)
          done()
        })
    })

    it('should return can not find any product stock!! if :stock_id is wrong', done => {
      request(app)
        .get('/api/admins/products/1/stocks/99')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('can not find any product stock!!')
          done()
        })
    })
  })

  context('putProductStockProps request', () => {
    it('should successfully create new color, size and update stock', done => {
      request(app)
        .put('/api/admins/products/1/stocks/1')
        .set('Authorization', 'bearer ' + APItoken)
        .send({
          color: 'blue',
          size: 'S',
          stock: 5
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          const colors = await db.Color.findAll()
          const sizes = await db.Size.findAll()
          const p = await db.ProductStatus.findByPk(1)
          expect(p.stock).to.equal(5)
          expect(colors.length).to.equal(2)
          expect(res.body.status).to.equal('success')
          expect(res.body.message).to.equal('successfully edited')
          done()
        })
    })
  })

  context('addProductStockProps request', () => {
    it("should return error if user didn't submit color and size", done => {
      request(app)
        .post('/api/admins/products/1/stocks/')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('missing props!!')
          done()
        })
    })

    it('should return success and create size only', done => {
      request(app)
        .post('/api/admins/products/1/stocks/')
        .set('Authorization', 'bearer ' + APItoken)
        .send({ color: 'blue', size: 'M' })
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          const colors = await db.Color.findAll({})
          const sizes = await db.Size.findAll({})
          expect(colors.length).to.equal(2)
          expect(sizes.length).to.equal(2)
          expect(res.body.status).to.equal('OK')
          done()
        })
    })
  })

  context('deleteProductStockProp request', done => {
    it('should return no matching productStatus founded!! if wrong :stock_id', done => {
      request(app)
        .delete('/api/admins/products/1/stocks/9')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal(
            'no matching productStatus founded!!'
          )
          done()
        })
    })

    it('should delete product prop and return productStatus is successfully deleted!!', done => {
      request(app)
        .delete('/api/admins/products/1/stocks/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          const productStatuses = await db.ProductStatus.findAll({})
          expect(productStatuses.length).to.equal(2)
          expect(res.body.status).to.equal('success')
          expect(res.body.message).to.equal(
            'productStatus is successfully deleted!!'
          )
          done()
        })
    })
  })

  context('deleteProductStockProp request', done => {
    it('should return error if any productStatuses are associated to deleting product', done => {
      request(app)
        .delete('/api/admins/products/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal(
            'product cannot be deleted if is associated to any productstatuses!!'
          )
          done()
        })
    })

    describe('should delete the product if no productStatus is not associated', done => {
      before(async () => {
        await db.ProductStatus.destroy({ where: {}, truncate: true })
      })
      it('should successfully delete', done => {
        request(app)
          .delete('/api/admins/products/1')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'product was successfully deleted!!'
            )
            done()
          })
      })
    })
  })

  context('getOrders request', done => {
    describe('should all orders', done => {
      before(async () => {
        await db.Order.bulkCreate([{ UserId: 1 }, { UserId: 1 }])
      })
      it('should return a json data', done => {
        request(app)
          .get('/api/admins/orders')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.orders.length).to.equal(2)
            done()
          })
      })
    })
  })

  context('getOrder request', done => {
    it('should return no order found', done => {
      request(app)
        .get('/api/admins/orders/99')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('no such order found!!')
          done()
        })
    })
    it('should return a json data', done => {
      request(app)
        .get('/api/admins/orders/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          expect(res.body.order.UserId).to.equal(1)
          done()
        })
    })
    after(async () => {
      await db.Image.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.ProductStatus.destroy({ where: {}, truncate: true })
      await db.Color.destroy({ where: {}, truncate: true })
      await db.Size.destroy({ where: {}, truncate: true })
    })
  })

  context('putOrder request', done => {
    it('should return update successful', done => {
      request(app)
        .put('/api/admins/orders/1')
        .send({ receiver_name: 'abc' })
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          expect(res.body.status).to.equal('OK')
          expect(res.body.message).to.equal('update successful')
          done()
        })
    })
    after(async () => {
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })

  context('deleteOrderProduct request', () => {
    describe('# when admin is deleting a product in an existed order', () => {
      before(async () => {
        await db.Product.create({ name: 'test1' })
        await db.Order.create({})
        await db.OrderItem.create({
          OrderId: 1,
          color: 'red',
          size: 'S',
          product_name: 'test1'
        })
      })
      it('should return error if no such order item found', done => {
        request(app)
          .delete('/api/admins/orders/1/product')
          .send({
            productName: 'test99',
            color: 'red',
            size: 'S'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('no such orderItem found!!')
            done()
          })
      })
      it('should successfully delete the order item', done => {
        request(app)
          .delete('/api/admins/orders/1/product')
          .send({
            productName: 'test1',
            color: 'red',
            size: 'S'
          })
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'orderItem successfully deleted!!'
            )
            const orderitem = await db.OrderItem.findAll({})
            expect(orderitem.length).to.equal(0)
            done()
          })
      })

      after(async () => {
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })
      })
    })
  })

  context('getUsers request', done => {
    it('should return a json data', done => {
      request(app)
        .get('/api/admins/users')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          expect(res.body.users.rows.length).to.equal(1)
          expect(res.body.users.rows[0].name).to.equal('Admin1')
          done()
        })
    })
  })

  context('getUserOrders request', done => {
    before(async () => {
      await db.Order.create({ UserId: 1 })
    })
    it('should return a json data', done => {
      request(app)
        .get('/api/admins/users/1/orders')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          expect(res.body.users.orders.length).to.equal(1)
          done()
        })
    })
  })

  context('addProduct request', () => {
    before(async () => {
      await db.Product.create({ name: 'product1' })
    })
    it('should return error if no column is filled', done => {
      request(app)
        .post('/api/admins/products')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('every column is required!!')
          done()
        })
    })
    it('should product is existed if same product name is existed', done => {
      request(app)
        .post('/api/admins/products')
        .send({
          name: 'product1',
          categoryId: 1,
          originPrice: 100,
          sellPrice: 200,
          description: 'Product1 des'
        })
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal(
            'same product name already existed!!'
          )
          done()
        })
    })
    it('should return products successfully created!!', done => {
      request(app)
        .post('/api/admins/products')
        .send({
          name: 'product3',
          categoryId: 1,
          originPrice: 100,
          sellPrice: 200,
          description: 'Product3 des'
        })
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success')
          expect(res.body.message).to.equal('products successfully created!!')
          done()
        })
    })
  })

  context('putProduct request', () => {
    before(async () => {
      await db.Product.create({ name: 'product1' })
    })
    it('should return error if no column is filled', done => {
      request(app)
        .put('/api/admins/products/1')
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal('every column is required!!')
          done()
        })
    })
    it('should product is existed if same product name is existed', done => {
      request(app)
        .put('/api/admins/products/1')
        .send({
          name: 'product3',
          categoryId: 1,
          originPrice: 100,
          sellPrice: 200,
          description: 'Product3 des',
          status: 'on'
        })
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.status).to.equal('error')
          expect(res.body.message).to.equal(
            'same product name already existed!!'
          )
          done()
        })
    })
    it('should return product was successfully updated!!', done => {
      request(app)
        .put('/api/admins/products/1')
        .send({
          name: 'product100',
          categoryId: 1,
          originPrice: 100,
          sellPrice: 200,
          description: 'Product3 des',
          status: 'on'
        })
        .set('Authorization', 'bearer ' + APItoken)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success')
          expect(res.body.message).to.equal(
            'product was successfully updated!!'
          )
          done()
        })
    })
  })

  context('deleteProduct request', () => {
    describe('when admin is going to delete a product associated with a productStatus', () => {
      before(async () => {
        await db.Product.create({ id: 99, name: 'product99' })
        await db.ProductStatus.create({ ProductId: 99 })
      })
      it('should return cannot be deleted', done => {
        request(app)
          .delete('/api/admins/products/99')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal(
              'product cannot be deleted if is associated to any productstatuses!!'
            )
            done()
          })
      })
    })
    describe('when admin is going to delete a product associated with a productStatus', () => {
      before(async () => {
        await db.ProductStatus.destroy({ where: {}, truncate: true })
      })
      it('should successfully delete the product', done => {
        request(app)
          .delete('/api/admins/products/99')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal(
              'product was successfully deleted!!'
            )
            done()
          })
      })
    })
  })

  context('deleteImage request', () => {
    describe('when admin is going to delete image', () => {
      before(async () => {
        await db.Image.create({})
      })
      it('should return no such image found!! if params is wrong', done => {
        request(app)
          .delete('/api/admins/image/99')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error')
            expect(res.body.message).to.equal('no such image found!!')
            done()
          })
      })
      it('should successfully delete an image', done => {
        request(app)
          .delete('/api/admins/image/1')
          .set('Authorization', 'bearer ' + APItoken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success')
            expect(res.body.message).to.equal('Image successfully deleted!!')
            done()
          })
      })
    })
  })

  after(async () => {
    await db.User.destroy({ where: {}, truncate: true })
    await db.Image.destroy({ where: {}, truncate: true })
    await db.Product.destroy({ where: {}, truncate: true })
    await db.Category.destroy({ where: {}, truncate: true })
    await db.ProductStatus.destroy({ where: {}, truncate: true })
    await db.Color.destroy({ where: {}, truncate: true })
    await db.Size.destroy({ where: {}, truncate: true })
    await db.Order.destroy({ where: {}, truncate: true })
  })
})
