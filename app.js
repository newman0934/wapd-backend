const express = require("express")
const session = require("express-session")
const methodOverride = require("method-override")
const flash = require("connect-flash")
const db = require("./models")
const passport = require("./config/passport")
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')

app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(session({secret:"secret", resave:"false",saveUninitialized:"false"}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next) => {
    res.locals.success_messages = req.flash("success_messages")
    res.locals.error_messages = req.flash("error_messages")
    res.locals.userAuth = req.session.user
    next()
})
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})

require("./routes")(app)