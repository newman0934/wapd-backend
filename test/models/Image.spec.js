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
const ImageModel = require('../../models/image')

describe('# Image Model', () => {
  before(done => {
    done()
  })

  const Image = ImageModel(sequelize, dataTypes)
  const image = new Image()
  checkModelName(Image)('Image')

  context('properties', () => {
    ;['url'].forEach(checkPropertyExists(image))
  })

  context('associations', () => {
    const Product = 'Product'
    before(() => {
      Image.associate({ Product })
    })

    it('should belong to products', done => {
      expect(Image.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Image.create({}).then(image => {
        data = image
        done()
      })
    })
    it('read', done => {
      db.Image.findByPk(data.id).then(image => {
        expect(data.id).to.be.equal(image.id)
        done()
      })
    })
    it('update', done => {
      db.Image.update({}, { where: { id: data.id } }).then(() => {
        db.Image.findByPk(data.id).then(image => {
          expect(data.updatedAt).to.be.not.equal(image.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Image.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Image.findByPk(data.id).then(image => {
          expect(image).to.be.equal(null)
          done()
        })
      })
    })
  })
})
