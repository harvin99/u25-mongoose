const express = require('express')
const router = express.Router()
const multer = require('multer')
//For file upload
const upload = multer({dest: './public/bookcovers/'})

const bookControllers = require('../controllers/books.controller')

router.get('/', bookControllers.getBook)
router.get('/create', bookControllers.createBook)
router.post('/create', bookControllers.postCreateBook)
router.get('/:id', bookControllers.getBookId)
router.post('/:id', bookControllers.postBookId)
router.get('/:id/delete', bookControllers.getBookIdToDelete)
router.get('/add_book_cover/:id', bookControllers.getBookCover)
router.post('/add_book_cover/:id', upload.single('bookcover'), bookControllers.postBookCover)

module.exports = router