const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const db = require('../config/db')
const Projects = require('./Project')

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El Email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0

    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        }
    }
})

//Métodos personalizados
Users.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
Users.hasMany(Projects) // Un usuario tiene n proyectos
module.exports = Users