const Session = require('../models/sessions.model')
const Book = require('../models/books.model')
const Transaction = require('../models/transactions.model')

module.exports.addToCart = async (req, res, next) => {
    try {
        const bookId = req.params.bookId
        const sessionId = req.signedCookies.sessionId

        if(!sessionId){
            res.redirect('/books')
            return
        }
            
        const sess = await Session.findById({_id: sessionId})
        if(bookId in sess.cart){
            const count = sess.cart[bookId] 
            if (!count) {
                await Session.findByIdAndUpdate(
                    sessionId,
                    {
                        cart: {
                        ...sess.cart,
                        [bookId]: 1,
                        },
                    }
                );
            } else {
                await Session.findByIdAndUpdate(
                    sessionId,
                    { cart: { ...sess.cart, [bookId]: count + 1 } }
                );
            }
        }
        else{
            await Session.findByIdAndUpdate(
                sessionId,
                {
                    cart: {
                    ...sess.cart,
                    [bookId]: 1,
                    },
                }
            );
        }
        res.redirect('/books')
    } catch (error) {
        console.log(error.message)
    }
}
module.exports.getCart = async (req, res) => {
    try {
        var sessions = await Session.findById({_id : req.signedCookies.sessionId})
        var sumBook = 0
        var listBook = []
            //Delete defaultKey in cart
            for(key in sessions.cart){
                if(key === "defaultKey"){
                    delete sessions.cart.key
                    break
                }
            }
            console.log(sessions.cart)

            for(bookId in sessions.cart){
                var book = await Book.findById({_id: bookId})
                var bookData = {
                    id:book.id,
                    bookTitle: book.title,
                    cover: book.coverUrl ? book.coverUrl : book.image,
                    amount: sessions.cart[bookId]
                }
                listBook.push(bookData)
                sumBook += sessions.cart[bookId]
            }
        res.render('cart', {
            listBook : listBook
        })
    } catch (error) {
        console.log(error.message)
    }
}
module.exports.postCart = async (req, res) => {
    try {
        //If User Signed in
        if(req.signedCookies.userId){
            // const sessions = db.get('sessions')
            //                 .find({id: req.signedCookies.sessionId})
            //                 .value()
            const sessions = await Session.findOne({id: req.signedCookies.sessionId})
            for(bookId in sessions.cart){
                    // var rent = {
                    //     id: shortid.generate(),
                    //     userId: req.signedCookies.userId,
                    //     bookId: bookId,
                    //     isComplete: false
                    // }
                    let rent = new Transaction()
                    rent.userId = req.signedCookies.userId
                    rent.bookId = bookId
                    rent.isComplete = false
                    //db.get('rents').push(rent).write()
                    rent.save(function(error){
                        if(error)
                            return console.error(error)
                    })
            }
            res.redirect('/transactions')
        }
        else{
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}