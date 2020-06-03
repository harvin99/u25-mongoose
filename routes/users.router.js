const express = require('express')
var multer  = require('multer')

const router = express.Router()

var upload = multer({ dest: './public/uploads/' })

const userControllers = require('../controllers/users.controller')
const userValidate = require('../validate/users.validate')

const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', userControllers.getUser)
router.get('/create_user', userControllers.createUser)
router.post('/create_user', userValidate.validatePostCreateUser , userControllers.postCreateUser)
router.get('/profile', userControllers.getProfileUser)
router.get('/profile/avatar', userControllers.getUpdateAvatar)
router.post('/profile/avatar', upload.single('avatar'), userControllers.postUpdateAvatar)
router.get('/:id', userControllers.getUserId)
router.post('/:id', userControllers.postUserId)
router.get('/:id/delete', userControllers.getUserIdToDelete)

module.exports = router