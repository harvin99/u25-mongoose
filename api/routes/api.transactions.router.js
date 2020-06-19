const express = require('express')
const apiTransactionsController = require('../controllers/api.transactions.controller')

const router = express.Router()

router.get('/', apiTransactionsController.getTransaction)


module.exports = router