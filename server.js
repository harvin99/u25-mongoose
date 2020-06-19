require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const apiLoginRouter = require('./api/routes/api.login.router')
const apiTransactionsRouter = require('./api/routes/api.transactions.router')

const booksRouter = require('./routes/books.router')
const usersRouter = require('./routes/users.router')
const authRouter = require('./routes/auth.router')
const transactionsRouter = require('./routes/transactions.router')
const cartRouter = require('./routes/cart.router')

const authMiddleware = require('./middlewares/auth.middleware')
const sessionMiddleware = require('./middlewares/session.middleware')
//For DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify : false
})
//Connect mongoose 
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected !!!')
})
const app = express()
//For body parser 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//For favicon
app.use(express.static('public'))
app.use(cookieParser(process.env.SESSION_KEY))
//For middleware
app.use(sessionMiddleware)

//Set view engine template
app.set('view engine', 'pug')
app.set('views', './views')
//For API
app.use('/api/login', apiLoginRouter)
app.use('/api/transactions', apiTransactionsRouter)
//Router
app.get('/', (req,res) => {
  res.render('index')
})
app.use('/books', booksRouter)
app.use('/users', authMiddleware.requireAuth, usersRouter)
app.use('/auth', authRouter)
app.use('/transactions', authMiddleware.requireAuth, transactionsRouter)
app.use('/cart', cartRouter)

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
