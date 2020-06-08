const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
//for db
const adapter = new FileSync('db.json')
const db = low(adapter)


module.exports.getTransaction = (req, res) => {
  const user = db.get('users').find({id: req.signedCookies.userId}).value()
  var page = parseInt(req.query.page) || 1
  const perPage = 8

  var start = (page - 1)* perPage
  var end = page * perPage
  var items = db.get("rents").value().slice(start, end)
  var list = []
  
  if(user.isAdmin){
    for(tran of items){
      let item = {
        userName: db.get('users').find({id: tran.userId}).value().name,
        bookTitle: db.get('books').find({id: tran.bookId}).value().title
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
    const tranUser = items.filter(item => item.userId === user.id)
    if(tranUser.length > 1){
      for(tran of tranUser){
        let item = {
          userName: db.get('users').find({id: tran.userId}).value().name,
          bookTitle: db.get('books').find({id: tran.bookId}).value().title
        }
        list.push(item)
      }
    }
    else{
      let item = {
        userName: db.get('users').find({id: tranUser.userId}).value().name,
        bookTitle: db.get('books').find({id: tranUser.bookId}).value().title
      }
      list.push(item)
    }
    console.log(list)
    res.render('transactions', {
      trans: list,
      idAdmin: false
    })
  }
}

module.exports.getCreateTransaction = (req, res) => {
  res.render('transactions_create',{
    users: db.get('users').value(),
    books: db.get('books').value()
  })
}

module.exports.postCreateTransaction = (req, res) => {
  const rent = {
    id: shortid.generate(),
    userId: req.body.selectedname,
    bookId: req.body.selectedbook,
    isComplete: false
  }
  db.get('rents').push(rent).write()
  res.redirect('/transactions')
}
module.exports.getIdTransactionToComplete = (req, res) => {
  const rent = db.get('rents').find({id: req.params.id})
  //console.log(rent)
  if(rent == null)
    res.render('error')
  else
    {
      db.get('rents')
        .find({ id: req.params.id})
        .assign({ isComplete: true})
        .write()
    res.redirect('/transactions')
    }
}