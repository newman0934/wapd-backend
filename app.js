const express = require('express')
const responseTime = require('response-time')
const session = require('express-session')
const methodOverride = require('method-override')
const db = require('./models')
const cors = require('cors')
const ordersChecker = require('./utils/ordersChecker')
const rateLimit = require('express-rate-limit')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // limit each IP to 100 requests per windowMs
  message:
    'Too many accounts created from this IP, please try again after a few moments'
})

const passport = require('./config/passport')

const app = express()
const port = process.env.PORT
  ? process.env.PORT
  : process.env.NODE_ENV === 'test'
  ? 3030
  : 3000
const bodyParser = require('body-parser')

app.set('trust proxy', 1)

app.use('/api-docs', express.static('public'))
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://newman0934.github.io',
      'https://easonlin0716.github.io'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)
app.use(
  responseTime((req, res, time) => {
    console.log(req.method, req.url, Math.floor(time) + 'ms')
  })
)
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: 'wapd',
    name: 'wapd',
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.userAuth = req.session.user
  next()
})
app.use('/upload', express.static(__dirname + '/upload'))
app.use('/api/', apiLimiter)

if (process.env.NODE_ENV !== 'test') {
  ordersChecker([0, 10, 0], 7200000)
}

app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app
