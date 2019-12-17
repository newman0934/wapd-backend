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
const FavoriteModel = require('../../models/favorite')

describe('# Favorite Model', () => {
  before(done => {
    done()
  })

  const Favorite = FavoriteModel(sequelize, dataTypes)
  const favorite = new Favorite()
  checkModelName(Favorite)('Favorite')

  context('properties', () => {
    ;['UserId', 'ProductId'].forEach(checkPropertyExists(favorite))
  })
})
