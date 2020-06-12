const mongoose = require('mongoose')

const transacstionSchema = new mongoose.Schema({
    userId : String,
    bookId : String,
    isComplete: Boolean
})
const Transaction = mongoose.model('Transaction', transacstionSchema, 'rents')

module.exports = Transaction