const User = require('../../models/users.model')
const Book = require('../../models/books.model')
const Transaction = require('../../models/transactions.model')

const shortid = require('shortid')

module.exports.getTransaction = async (req, res) => {
    try {
        const user = await User.findById({_id: req.signedCookies.userId})

        var trans = await Transaction.find()
        
        if(trans){
            var items = trans
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
                res.status(200).json({trans : list})
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
                    res.status(200).json({trans : list})
                }
                else{
                    res.status(200).json({trans : list})
                }
            }       
        }
    } catch (error) {
        console.log(error.message)
  }
}