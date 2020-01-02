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
const SizeModel = require('../../models/size')

describe('# Size Model', () => {
  before(done => {
    done()
  })

  const Size = SizeModel(sequelize, dataTypes)
  const size = new Size()
  checkModelName(Size)('Size')

  context('properties', () => {
    ;['size'].forEach(checkPropertyExists(size))
  })

  context('associations', () => {
    const ProductStatus = 'ProductStatus'
    before(() => {
      Size.associate({ ProductStatus })
    })

    it('should have many productstatuses', done => {
      expect(Size.hasMany).to.have.been.calledWith(ProductStatus)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Size.create({}).then(size => {
        data = size
        done()
      })
    })
    it('read', done => {
      db.Size.findByPk(data.id).then(size => {
        expect(data.id).to.be.equal(size.id)
        done()
      })
    })
    it('update', done => {
      db.Size.update({}, { where: { id: data.id } }).then(() => {
        db.Size.findByPk(data.id).then(size => {
          expect(data.updatedAt).to.be.not.equal(size.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Size.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Size.findByPk(data.id).then(size => {
          expect(size).to.be.equal(null)
          done()
        })
      })
    })
  })
})
