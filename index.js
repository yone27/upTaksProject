const bodyParser = require('body-parser')
const express = require('express')
const flash = require('connect-flash')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const passport = require('./config/passport')

//Helpers
const helpers = require('./helpers')

// DB
const db = require('./config/db')

// Models
require('./models/Project')
require('./models/Task')
require('./models/User')

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

// Initializations
const app = express()

// Settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))


//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(flash())
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    next()
})

// Routes
app.use('/', routes)

// Server start :D
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})