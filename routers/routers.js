const router = require('express').Router()
var Admin = require('../middleware/admin')
// Home
router.get('/', require('../controllers/homeController').index)

// Users
router.get('/user',Admin, require('../controllers/userController').index)
router.get('/user/:id', require('../controllers/userController').findById)
router.post('/user', require('../controllers/userController').create)
router.put('/user', require('../controllers/userController').update)
router.delete('/user/:id', require('../controllers/userController').delete)

// User recover
router.post('/recoverpassword', require('../controllers/userController').recoverPassowrd)
router.post("/changepassword", require('../controllers/userController').changePassword)

// Login
router.post("/login", require('../controllers/userController').login)


module.exports = router