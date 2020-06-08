const db = require('../db')
const shortid = require('shortid')


module.exports.addToCart = (req, res, next) => {
    const bookId = req.params.bookId
    const sessionId = req.signedCookies.sessionId

    if(!sessionId){
        res.redirect('/books')
        return
    }
    const count = db.get('sessions')
                    .find({id: sessionId})
                    .get('cart.' + bookId, 0)
                    .value()
    db.get('sessions')
        .find({id: sessionId})
        .set('cart.' + bookId, count + 1)
        .write()
        
    res.redirect('/books')
}
module.exports.getCart = (req, res) => {
    const sessions = db.get('sessions')
                        .find({id: req.signedCookies.sessionId})
                        .value()
    var sumBook = 0
    var listBook = []
        for(bookId in sessions.cart){
            var book = db.get('books').find({id: bookId}).value()
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
}
module.exports.postCart = (req, res) => {
    //If User Signed in
    if(req.signedCookies.userId){
        const sessions = db.get('sessions')
                        .find({id: req.signedCookies.sessionId})
                        .value()
        for(bookId in sessions.cart){
                var rent = {
                    id: shortid.generate(),
                    userId: req.signedCookies.userId,
                    bookId: bookId,
                    isComplete: false
                }
                db.get('rents').push(rent).write()
        }
        

        res.redirect('/transactions')
    }
    else{
        res.redirect('/auth/login')
    }
}