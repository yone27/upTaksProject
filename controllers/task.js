//Ref models
const Tasks = require('../models/Task')
const Projects = require('../models/Project')

exports.saveTask = async(req, res, next) => {
    //Obtenemos el proyeto act
    const project = await Projects.findOne({ where: { url: req.params.url } })

    //leer la tarea
    const { task } = req.body,
        status = 0,
        projectId = project.id

    //Insertar y redireccionar
    const result = await Tasks.create({ task, status, projectId })

    if (!result) {
        return next()
    }

    //redirect
    res.redirect(`/projects/${req.params.url}`)
}
exports.changeStatus = async(req, res, next) => {
    const { id } = req.params

    const task = await Tasks.findOne({
        where: {
            id
        }
    })

    // cambiar el estado 
    let status = 0
    if (task.status === status) {
        task.status = 1
    } else {
        task.status = status
    }

    const result = await task.save()
    if (!result) {
        return next()
    }
    res.status(200).send('Actualizado')
}
exports.deleteTask = async(req, res, next) => {
    const { id } = req.params

    const result = await Tasks.destroy({
        where: { id }
    })

    if (!result) {
        return next()
    }

    res.status(200).send('tarea eliminada correctamente')
}