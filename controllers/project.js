//Ref models
const Projects = require('../models/Project')
const Tasks = require('../models/Task')

exports.getHome = async(req, res) => {
    const userId = res.locals.usuario.id
    const projects = await Projects.findAll({
        where: { userId }
    })
    res.render('index', {
        pageName: 'Proyectos',
        projects
    });
}

exports.viewProject = async(req, res) => {
    const userId = res.locals.usuario.id
    const projects = await Projects.findAll({
        where: { userId }
    })

    res.render('project', {
        pageName: 'Nuevo Proyecto',
        projects
    });
}
exports.saveProject = async(req, res) => {
    const userId = res.locals.usuario.id
    const projects = await Projects.findAll({
        where: { userId }
    })

    const { name } = req.body
    let errors = []

    if (!name) {
        errors.push({ 'text': 'Agrega un nombre al proyecto' })
    }

    if (errors.length > 0) {
        res.render('project', {
            pageName: 'Nuevo Proyecto',
            errors,
            projects
        })
    } else {
        //insert into db
        const userId = res.locals.usuario.id
        await Projects.create({ name, userId });
        res.redirect('/project')
    }
}
exports.getProject = async(req, res, next) => {
    const userId = res.locals.usuario.id

    const projectsPromise = Projects.findAll({
        where: { userId }
    })
    const projectPromise = Projects.findOne({
        where: {
            url: req.params.url
        }
    })
    const [projects, project] = await Promise.all([projectsPromise, projectPromise])

    //consultar tareas de proyecto actual
    const tasks = await Tasks.findAll({
        where: {
            projectId: project.id
        }
    })

    if (!project) return next()

    res.render('tasks', {
        pageName: 'Tareas del proyecto',
        project,
        projects,
        tasks
    })
}
exports.viewEditProject = async(req, res) => {
    const userId = res.locals.usuario.id

    const projectsPromise = Projects.findAll({
        where: { userId }
    })
    const projectPromise = Projects.findOne({
        where: {
            id: req.params.id
        }
    })
    const [projects, project] = await Promise.all([projectsPromise, projectPromise])
    res.render('project', {
        pageName: 'Editar Proyecto',
        projects,
        project
    });
}
exports.updateProject = async(req, res) => {
    const userId = res.locals.usuario.id
    const projects = await Projects.findAll({
        where: { userId }
    })

    const { name } = req.body
    let errors = []

    if (!name) {
        errors.push({ 'text': 'Agrega un nombre al proyecto' })
    }

    if (errors.length > 0) {
        res.render('project', {
            pageName: 'Nuevo Proyecto',
            errors,
            projects
        })
    } else {
        //insert into db

        await Projects.update({ name }, { where: { id: req.params.id } });
        res.redirect('/project/edit/' + req.params.id)
    }
}
exports.deleteProject = async(req, res, next) => {
    const { projectUrl } = req.query

    const result = await Projects.destroy({ where: { url: projectUrl } })

    if (!result) {
        return next()
    }

    res.status(200).send('Proyecto eliminado correctamente')
}