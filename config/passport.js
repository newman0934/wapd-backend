const passport = require('passport')
const LocalStrategy = require('passport-local')
const db = require('../models')
const User = db.User
const Product = db.Product
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
  let user = await User.findByPk(jwt_payload.id, {
    include: [
      {
        model: Product,
        required: false,
        as: 'FavoritedProducts',
        where: {
          status: 'on'
        }
      }
    ]
  })
  if (!user) {
    user = await User.findByPk(jwt_payload.id)
    user.FavoritedProducts = []
  }
  if (!user) return next(null, false)
  return next(null, user)
})
passport.use(strategy)

module.exports = passport
