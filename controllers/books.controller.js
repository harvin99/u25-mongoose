const Book = require('../models/books.model') 
const User = require('../models/users.model')


module.exports.getBook = async (req, res) => {
  try {
    //const user = db.get('users').find({id : req.signedCookies.userId}).value()
    if(req.signedCookies.userId)
      var user = await User.findById({_id: req.signedCookies.userId})
    var page = parseInt(req.query.page) || 1
    const perPage = 8
  
    var start = (page - 1) * perPage
    var end = page * perPage
    //var items = db.get("books").value().slice(start, end)
  
    var books = await Book.find()
    var items = books.slice(start, end)
    res.render("books", { 
      currenPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      list: items,
      user: user
    });
  } catch (error) {
    console.log(error.message)
  }
};

module.exports.createBook = (req, res) => {
  res.render("create");
};

module.exports.postCreateBook = (req, res) => {

  let book = new Book()
  book.title = req.body.title
  book.description = req.body.description
  book.image = "https://loremflickr.com/320/240"

  book.save(function(error){
    if(error) 
      return console.error(error)
    else
      res.redirect("/books");
  })
  
};

module.exports.getBookId = async (req, res) => {
  try {
    const resultBook = await Book.findById({_id: req.params.id})
    res.render("edit", { book: book });
  } catch (error) {
    console.log(error.message)
  }
};

module.exports.postBookId = async (req, res) => {
  try {
    const resultBook = await Book.findByIdAndUpdate(req.params.id,
                        { title: req.body.title, description: req.body.description })
    res.redirect("/books");
  } catch (error) {
      console.log(error.message)
  }
};

module.exports.getBookIdToDelete = async (req, res) => {
  try {
    const resultBookRemoved = await Book.findByIdAndDelete(req.params.id)
    res.redirect("/books");
  } catch (error) {
    console.log(error.message)
  }
};

module.exports.getBookCover = (req, res) => { 
  res.render('add_book_cover')
}
module.exports.postBookCover = async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id,
      {coverUrl : req.file.path.split('\\').slice(1).join('/')})
    res.redirect('/books')
  } catch (error) {
    console.log(error.message)
  }
}