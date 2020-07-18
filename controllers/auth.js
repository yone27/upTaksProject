const passport = require('passport')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

//Ref models
const Users = require('../models/User')

//emailHandler
const enviarEmail = require('../handler/email')

// Validación del inicio de sesión
exports.signIn = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

// Identifica que el usuario este logeado sino lo envia al '/login'
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/login')
}

// Destruye la sesión del usuario actual
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

// Genera un token valido para el usuario
exports.sendToken = async(req, res) => {
    const user = await Users.findOne({ where: { email: req.body.email } })

    if (!user) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('reset')
    }

    //Usuario existe
    user.token = crypto.randomBytes(20).toString('hex')
    user.expiracion = Date.now() + 360000; //1h

    //Guardarlos en la db
    await user.save()

    //URL Reset
    const resetUrl = `http://${req.headers.host}/reset/${user.token}`

    //Envia el correo con el token
    await enviarEmail.enviar({
        user,
        subject: 'Password reset',
        resetUrl,
        file: 'resetPassword'
    })

    // Terminar la ejecución
    req.flash('correcto', 'se envio un mensaje a tu correo')
    res.redirect('login')
}

/*
    Verificamos que el token ingresado en la url sea valido 
    si lo esta lo redirigimos a reestablecer el password
*/
exports.tokenValidation = async(req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token
        }
    })

    if (!user) {
        req.flash('error', 'No válido')
        res.redirect('/reset')
    }

    //form para generar contra
    res.render('resetPassword', {
        pageName: 'Restablecer contraseña'
    })
}

// Metodo post para resetear el password
exports.resetPassword = async(req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //Verificamos si el user exist
    if (!user) {
        req.flash('error', 'No válido')
        res.redirect('/reset')
    }

    //hasheamos el nuevo pass
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    user.token = null
    user.expiracion = null

    //guardamos el nuevo password
    await user.save()
    req.flash('correcto', 'tu password se ha modificado correctamente')
    res.redirect('/login')
}