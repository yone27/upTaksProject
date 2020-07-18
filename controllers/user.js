const Users = require('../models/User')
const enviarEmail = require('../handler/email')

exports.viewRegister = (req, res) => {
    res.render('register', {
        pageName: 'Crear cuenta'
    })
}
exports.viewLogin = (req, res) => {
    const { error } = res.locals.mensajes
    res.render('login', {
        pageName: 'Iniciar sesión',
        error
    })
}
exports.signup = async(req, res) => {
    // Leer los datos
    const { email, password } = req.body

    try {
        await Users.create({
            email,
            password
        })

        // Crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`


        //crar el obj user
        const user = {
            email
        }

        //Enviar email
        await enviarEmail.enviar({
            user,
            subject: 'Confirma tu cuenta uptask',
            confirmarUrl,
            file: 'confirmAccount'
        })

        //Redirigir
        req.flash('correcto', 'enviamos un correo, confirma tu cuenta')
        res.redirect('/register')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))

        res.render('register', {
            pageName: 'Crear cuenta',
            mensajes: req.flash(),
            email,
            password
        })
    }
}

// RESET PASSWORD
exports.formResetPassword = (req, res) => {
    res.render('reset', {
        pageName: 'Restablezca su contraseña'
    })
}

// Confirmar cuenta
exports.confirmAccount = async(req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.params.email
        }
    })

    if (!user) {
        req.flash('error', 'No existe')
        res.redirect('/register')
    }

    user.activo = 1
    await user.save()
    req.flash('correcto', 'Cuenta activada correctamente')
    res.redirect('/login')
}