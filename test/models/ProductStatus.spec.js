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
const ProductStatusModel = require('../../models/productstatus')

describe('# ProductStatus Model', () => {
  before(done => {
    done()
  })

  const ProductStatus = ProductStatusModel(sequelize, dataTypes)
  const productstatus = new ProductStatus()
  checkModelName(ProductStatus)('ProductStatus')

  context('properties', () => {
    ;['sales', 'stock', 'ColorId', 'ProductId', 'SizeId'].forEach(
      checkPropertyExists(productstatus)
    )
  })

  context('associations', () => {
    const Product = 'Product'
    const Color = 'Color'
    const Size = 'Size'

    before(() => {
      ProductStatus.associate({ Product })
      ProductStatus.associate({ Color })
      ProductStatus.associate({ Size })
    })

    it('should belong to many products', done => {
      expect(ProductStatus.belongsTo).to.have.been.calledWith(Product)
      done()
    })
    it('should belong to many products', done => {
      expect(ProductStatus.belongsTo).to.have.been.calledWith(Color)
      done()
    })
    it('should belong to many products', done => {
      expect(ProductStatus.belongsTo).to.have.been.calledWith(Size)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.ProductStatus.create({}).then(productstatus => {
        data = productstatus
        done()
      })
    })
    it('read', done => {
      db.ProductStatus.findByPk(data.id).then(productstatus => {
        expect(data.id).to.be.equal(productstatus.id)
        done()
      })
    })
    it('update', done => {
      db.ProductStatus.update({}, { where: { id: data.id } }).then(() => {
        db.ProductStatus.findByPk(data.id).then(productstatus => {
          expect(data.updatedAt).to.be.not.equal(productstatus.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.ProductStatus.destroy({ where: { id: data.id }, truncate: true }).then(
        () => {
          db.ProductStatus.findByPk(data.id).then(productstatus => {
            expect(productstatus).to.be.equal(null)
            done()
          })
        }
      )
    })
  })
})
