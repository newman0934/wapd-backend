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
const CategoryModel = require('../../models/category')

describe('# Category Model', () => {
  before(done => {
    done()
  })

  const Category = CategoryModel(sequelize, dataTypes)
  const category = new Category()
  checkModelName(Category)('Category')

  context('properties', () => {
    ;['category'].forEach(checkPropertyExists(category))
  })

  context('associations', () => {
    const Product = 'Product'
    before(() => {
      Category.associate({ Product })
    })

    it('should have many products', done => {
      expect(Category.hasMany).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Category.create({}).then(category => {
        data = category
        done()
      })
    })
    it('read', done => {
      db.Category.findByPk(data.id).then(category => {
        expect(data.id).to.be.equal(category.id)
        done()
      })
    })
    it('update', done => {
      db.Category.update({}, { where: { id: data.id } }).then(() => {
        db.Category.findByPk(data.id).then(category => {
          expect(data.updatedAt).to.be.not.equal(category.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Category.destroy({ where: { id: data.id }, truncate: true }).then(
        () => {
          db.Category.findByPk(data.id).then(category => {
            expect(category).to.be.equal(null)
            done()
          })
        }
      )
    })
  })
})
