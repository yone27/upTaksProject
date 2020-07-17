const Sequelize = require('sequelize')
const db = new Sequelize('uptasknode', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', // 'sqlite' | 'postgres' | 'mssql'
    operatorsAliases: false,
    port: 3306,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

module.exports = db