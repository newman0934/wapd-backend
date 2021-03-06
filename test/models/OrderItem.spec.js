process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const OrderItemModel = require('../../models/orderitem')

describe('# OrderItem Model', () => {
  before(done => {
    done()
  })

  const OrderItem = OrderItemModel(sequelize, dataTypes)
  const orderitem = new OrderItem()
  checkModelName(OrderItem)('OrderItem')

  context('properties', () => {
    ;[
      'size',
      'color',
      'sell_price',
      'quantity',
      'OrderId',
      'ProductId'
    ].forEach(checkPropertyExists(orderitem))
  })
})
