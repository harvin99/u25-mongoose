const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
//for db
const adapter = new FileSync("db.json");
const db = low(adapter);

module.exports.getBook = (req, res) => {
  const user = db.get('users').find({id : req.signedCookies.userId}).value()
  var page = parseInt(req.query.page) || 1
  const perPage = 8

  var start = (page - 1)* perPage
  var end = page * perPage
  var items = db.get("books").value().slice(start, end)
  res.render("books", { 
    currenPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    list: items,
    user: user
  });
};

module.exports.createBook = (req, res) => {
  res.render("create");
};

module.exports.postCreateBook = (req, res) => {
  const book = {
    id: shortid.generate(),
    title: req.body.title,
    description: req.body.description,
    image: "https://loremflickr.com/320/240"
  };
  db.get("books")
    .push(book)
    .write();
  res.redirect("/books");
};

module.exports.getBookId = (req, res) => {
  const book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  res.render("edit", { book: book });
};

module.exports.postBookId = (req, res) => {
  db.get("books")
    .find({ id: req.params.id })
    .assign({ title: req.body.title, description: req.body.description })
    .write();
  res.redirect("/books");
};

module.exports.getBookIdToDelete = (req, res) => {
  db.get("books")
    .remove({ id: req.params.id })
    .write();
  res.redirect("/books");
};
