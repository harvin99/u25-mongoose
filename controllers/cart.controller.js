const db = require('../db')
const shortid = require('shortid')


module.exports.addToCart = (req, res, next) => {
    const bookId = req.params.bookId
    const sessionId = req.signedCookies.sessionId

    if(!sessionId){
        res.redirect('/books')
        return
    }

    db.get('sessions')
        .find({id: sessionId})
        .set('cart.' + bookId, 1)
        .write()
        
    res.redirect('/books')
}