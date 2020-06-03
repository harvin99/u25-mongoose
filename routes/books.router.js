const express = require('express')
const router = express.Router()

const bookControllers = require('../controllers/books.controller')

router.get('/', bookControllers.getBook)
router.get('/create', bookControllers.createBook)
router.post('/create', bookControllers.postCreateBook)
router.get('/:id', bookControllers.getBookId)
router.post('/:id', bookControllers.postBookId)
router.get('/:id/delete', bookControllers.getBookIdToDelete)

module.exports = router