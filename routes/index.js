const express = require('express')
const router = express.Router()
const ProjectCtrl = require('../controllers/project')
const TaskCtrl = require('../controllers/task')
const UserCtrl = require('../controllers/user')
const AuthCtrl = require('../controllers/auth')
const { body } = require('express-validator')

// DASHBOARD
router.get(
    '/',
    AuthCtrl.isAuthenticated,
    ProjectCtrl.getHome
)

// *ROUTER PROJECTS
router.get(
    '/project',
    AuthCtrl.isAuthenticated,
    ProjectCtrl.viewProject
)
router.post(
    '/project',
    AuthCtrl.isAuthenticated,
    body('name').not().isEmpty().trim().escape(),
    ProjectCtrl.saveProject
)
router.get(
    '/projects/:url',
    AuthCtrl.isAuthenticated,
    ProjectCtrl.getProject
)
router.get(
    '/project/edit/:id',
    AuthCtrl.isAuthenticated,
    ProjectCtrl.viewEditProject
)
router.post(
    '/project/:id',
    AuthCtrl.isAuthenticated,
    body('name').not().isEmpty().trim().escape(),
    ProjectCtrl.updateProject
)

router.delete(
    '/projects/:url',
    AuthCtrl.isAuthenticated,
    ProjectCtrl.deleteProject
)

// *ROUTER TASKS
router.post(
    '/projects/:url',
    AuthCtrl.isAuthenticated,
    TaskCtrl.saveTask
)
router.patch(
    '/tasks/:id',
    AuthCtrl.isAuthenticated,
    TaskCtrl.changeStatus
)
router.delete(
    '/tasks/:id',
    AuthCtrl.isAuthenticated,
    TaskCtrl.deleteTask
)

// *ROUTER USERS
router.get('/register', UserCtrl.viewRegister)
router.post('/register', UserCtrl.signup)
router.get('/login', UserCtrl.viewLogin)
router.post('/login', AuthCtrl.signIn)

// password reset
router.get('/reset', UserCtrl.formResetPassword)
router.post('/reset', AuthCtrl.sendToken)
router.get('/reset/:token', AuthCtrl.tokenValidation)
router.post('/reset/:token', AuthCtrl.resetPassword)

// account verification
router.get('/confirmar/:email', UserCtrl.confirmAccount)

// Logout
router.get('/logout', AuthCtrl.logout)

module.exports = router;