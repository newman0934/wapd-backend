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
const UserModel = require('../../models/user')

describe('# User Model', () => {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;['email', 'password'].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const CartItem = 'CartItem'
    const Order = 'Order'
    const Favorite = 'Favorite'
    const Product = 'Product'
    const Token = 'Token'
    before(() => {
      User.associate({ CartItem })
      User.associate({ Order })
      User.associate({ Product })
      User.associate({ Token })
    })

    it('should have many cartitems', done => {
      expect(User.hasMany).to.have.been.calledWith(CartItem)
      done()
    })
    it('should have many orders', done => {
      expect(User.hasMany).to.have.been.calledWith(Order)
      done()
    })
    it('should have many tokens', done => {
      expect(User.hasMany).to.have.been.calledWith(Token)
      done()
    })
    it('should have many favorites', done => {
      expect(User.belongsToMany).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.User.create({}).then(user => {
        data = user
        done()
      })
    })
    it('read', done => {
      db.User.findByPk(data.id).then(user => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', done => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.User.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
