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
const ColorModel = require('../../models/color')

describe('# Color Model', () => {
  before(done => {
    done()
  })

  const Color = ColorModel(sequelize, dataTypes)
  const color = new Color()
  checkModelName(Color)('Color')

  context('properties', () => {
    ;['color'].forEach(checkPropertyExists(color))
  })

  context('associations', () => {
    const ProductStatus = 'ProductStatus'
    before(() => {
      Color.associate({ ProductStatus })
    })

    it('should have many productstatuses', done => {
      expect(Color.hasMany).to.have.been.calledWith(ProductStatus)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Color.create({}).then(color => {
        data = color
        done()
      })
    })
    it('read', done => {
      db.Color.findByPk(data.id).then(color => {
        expect(data.id).to.be.equal(color.id)
        done()
      })
    })
    it('update', done => {
      db.Color.update({}, { where: { id: data.id } }).then(() => {
        db.Color.findByPk(data.id).then(color => {
          expect(data.updatedAt).to.be.not.equal(color.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Color.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Color.findByPk(data.id).then(color => {
          expect(color).to.be.equal(null)
          done()
        })
      })
    })
  })
})
