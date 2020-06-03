const express = require('express')
const router = express.Router()
const transactionControllers = require('../controllers/transactions.controller')

router.get('/', transactionControllers.getTransaction)
router.get('/create', transactionControllers.getCreateTransaction)
router.post('/create', transactionControllers.postCreateTransaction)
router.get('/:id/complete', transactionControllers.getIdTransactionToComplete)
module.exports = router