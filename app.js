const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const db = require('./models')
const cors = require('cors')

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
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = {
  swaggerDefinition: {
    // api doc description
    info: {
      title: 'wapd-api-doc',
      version: '0.1.0',
      description: 'wapd-api-doc for front-end user using swagger package'
    }
  },
  // 這邊會是你想要產生的api文件檔案，我是直接讓swagger去列出所有controllers
  apis: ['./controllers/api/*.js']
}
const specs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use(
  cors({
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // enable set cookie
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

app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app
