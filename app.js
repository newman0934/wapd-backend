const express = require('express')
const responseTime = require('response-time')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const db = require('./models')
const cors = require('cors')
const ordersChecker = require('./utils/ordersChecker')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT
  ? process.env.PORT
  : process.env.NODE_ENV === 'test'
  ? 3030
  : 3000
const bodyParser = require('body-parser')
app.use('/api-docs', express.static('public'))
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://newman0934.github.io',
      'https://easonlin0716.github.io'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // enable set cookie
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
app.use(cookieParser())
app.use(
  session({
    secret: 'wapd',
    name: 'wapd',
    resave: false,
    saveUninitialized: true
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.userAuth = req.session.user
  next()
})
app.use('/upload', express.static(__dirname + '/upload'))

if (process.env.NODE_ENV !== 'test') {
  ordersChecker([0, 10, 0], 7200000)
}

app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app
