require('dotenv').config()
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const booksRouter = require('./routes/books.router')
const usersRouter = require('./routes/users.router')
const authRouter = require('./routes/auth.router')
const transactionsRouter = require('./routes/transactions.router')

const authMiddleware = require('./middlewares/auth.middleware')

//For body parser 
app.use(express.urlencoded({extended: false}))
//For favicon
app.use(express.static('public'))
app.use(cookieParser(process.env.SESSION_KEY))

//Set view engine template
app.set('view engine', 'pug')
app.set('views', './views')
//Router
app.get('/', (req,res) => {
  res.render('index')
})
app.use('/books', authMiddleware.requireAuth, booksRouter)
app.use('/users', authMiddleware.requireAuth, usersRouter)
app.use('/auth', authRouter)
app.use('/transactions', authMiddleware.requireAuth, transactionsRouter)
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
