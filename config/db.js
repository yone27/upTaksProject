const Sequelize = require('sequelize')
const db = new Sequelize('uptasknode', 'root', '', {
// const db = new Sequelize('heroku_56848359e2c781c', 'b92ee7879695db', 'f959fb78', {
    // host: 'us-cdbr-east-02.cleardb.com',
    host: 'localhost',
    dialect: 'mysql', // 'sqlite' | 'postgres' | 'mssql'
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

//joseacaban1999@gmail.com

//mysql://b92ee7879695db:f959fb78@us-cdbr-east-02.cleardb.com/heroku_56848359e2c781c?reconnect=true