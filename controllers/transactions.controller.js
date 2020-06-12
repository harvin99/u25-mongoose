const User = require('../models/users.model')
const Book = require('../models/books.model')
const Transaction = require('../models/transactions.model')

const shortid = require('shortid')

module.exports.getTransaction = async (req, res) => {
  try {
    const user = await User.findById({_id: req.signedCookies.userId})

    var page = parseInt(req.query.page) || 1
    const perPage = 8
    var start = (page - 1)* perPage
    var end = page * perPage

    var trans = await Transaction.find()
    
    if(trans){
      var items = trans.slice(start, end)
      var list = []
      if(user.isAdmin){
          for(var tran of items){
            let tempUser = await User.findById({_id: tran.userId})
            let tempBook = await Book.findById({_id: tran.bookId})
            let item = {
                id : tran._id,
                userName : tempUser.name,
                bookTitle : tempBook.title,
                isComplete : tran.isComplete
            }
            list.push(item)
          }
          res.render('transactions', {
            trans: list,
            currenPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            isAdmin: true
          })
      }
      else
      {
          var tranUser = items.filter(item => item.userId === user.id)
          if(tranUser.length > 0){
            for(var tran of tranUser){
              let tempUser = await User.findById({_id: tran.userId})
              let tempBook = await Book.findById({_id: tran.bookId})
              let item = {
                id : tran._id,
                userName : tempUser.name,
                bookTitle : tempBook.title,
                isComplete: tran.isComplete
              }
              list.push(item)
            }
            res.render('transactions', {
              trans: list,
              idAdmin: false
            })
          }
          else{
            res.render('transactions', {
              trans: list,
              idAdmin: false
            })
          }
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}

module.exports.getCreateTransaction = async (req, res) => {
  try {
    var user = await User.findById({_id: req.signedCookies.userId})
    if(user.isAdmin){
      res.render('transactions_create',{
        users : await User.find(),
        books : await Book.find()
      })
    }
    else{
      res.render('transactions_create',{
        users : user,
        books : await Book.find()
      })
    }
    
  } catch (error) {
    console.log(error.message)
  }
}

module.exports.postCreateTransaction = (req, res) => {
  let rent = new Transaction()
  rent.userId =  req.body.selectedname
  rent.bookId = req.body.selectedbook
  rent.isComplete = false
  rent.save(function(error){
    if(error)
      return console.error(error)
    else
      res.redirect('/transactions')
  })
  
}
module.exports.getIdTransactionToComplete = async (req, res) => {
  try {
    const rent = await Transaction.findById({_id : req.params.id })
    if(rent == null)
      res.render('error')
    else
      {
        const resultTran = await Transaction.findByIdAndUpdate(req.params.id, { isComplete: true})
        res.redirect('/transactions')
      }
  } catch (error) {
    console.log(error.message)
  }
}