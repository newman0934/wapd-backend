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
const TokenModel = require('../../models/token')

describe('# Token Model', () => {
  before(done => {
    done()
  })

  const Token = TokenModel(sequelize, dataTypes)
  const token = new Token()
  checkModelName(Token)('Token')

  context('properties', () => {
    ;['token', 'UserId', 'isUsed'].forEach(checkPropertyExists(token))
  })

  context('associations', () => {
    const User = 'User'
    before(() => {
      Token.associate({ User })
    })

    it('should belong to users', done => {
      expect(Token.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', done => {
      db.Token.create({}).then(token => {
        data = token
        done()
      })
    })
    it('read', done => {
      db.Token.findByPk(data.id).then(token => {
        expect(token.id).to.be.equal(token.id)
        done()
      })
    })
    it('update', done => {
      db.Token.update({}, { where: { id: data.id } }).then(() => {
        db.Token.findByPk(data.id).then(token => {
          expect(data.updatedAt).to.be.not.equal(token.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Token.destroy({ where: { id: data.id }, truncate: true }).then(() => {
        db.Token.findByPk(data.id).then(token => {
          expect(token).to.be.equal(null)
          done()
        })
      })
    })
  })
})
