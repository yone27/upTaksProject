const Sequelize = require('sequelize')
const db = require('../config/db')
const Projects = require('./Project')

const Tasks = db.define('tasks', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    task: Sequelize.STRING(100),
    status: Sequelize.INTEGER(1)
})

Tasks.belongsTo(Projects) // N tareas pertenecen a un proyect

module.exports = Tasks