const passport = require('passport')
const localStrategy = require('passport-local').Strategy

// Ref model
const Users = require('../models/User')

// Local Strategy
passport.use(
    new localStrategy(
        //por default password espera user and password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const user = await Users.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })

                //El usuario existe, pero el password no
                if (!user.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }

                // Email existe y password correcto
                return done(null, user)
            } catch (err) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//serealizar 
passport.serializeUser((user, callback) => {
    callback(null, user)
})

//deserealizar
passport.deserializeUser((user, callback) => {
    callback(null, user)
})

module.exports = passport