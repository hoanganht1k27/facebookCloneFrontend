const express = require('express')
const logger = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')

const amaaRouter = require('./routes/amaa')
const googleLogin = require('./routes/googleLogin')

const dbString = 'mongodb://localhost:27017/amaasocialmedia'
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(dbString, dbOptions)
const db = mongoose.connection
db.once('open', () => {
    console.log("Connected")
})

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(flash())
app.use(cors())
app.use(cookieSession({
    maxAge: 1000 * 60,
    keys: ["anhnguyen"]
}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(function(req, res, next) {
//     res.locals.user = null
//     next()
// })

app.use(session({
    secret: 'anhnguyen',
    resave: false,
    saveUninitialized: true,
    cookie: {
        express: 1000 * 60 * 60 * 24
    }
}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/amaa', amaaRouter)
app.use('/googleLogin', googleLogin)

app.listen(process.env.PORT || 3000)
