const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
//for db
const adapter = new FileSync("db.json");
const db = low(adapter);

module.exports.getUser = (req, res) => {
  const user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();

  var page = parseInt(req.query.page) || 1
  const perPage = 8

  var start = (page - 1)* perPage
  var end = page * perPage
  var items = db.get("users").value().slice(start, end)

  if (user.isAdmin) {
    res.render("users", {
      users: items,
      currenPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      countUser: db.get("users").value().length,
      isAdmin: true
    });
  }
  else{
    res.render("users", {
      users: user,
      countUser: 1
    })
  }
};
module.exports.createUser = (req, res) => {
  res.render("create_user");
};
module.exports.postCreateUser = async (req, res) => {
  const existEmailUser = db
    .get("users")
    .find({ email: req.body.email })
    .value();
  if (existEmailUser) {
    res.render("create_user", {
      values: req.body,
      errors: ["Email was exist !"]
    });
    return;
  }
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  
  const user = {
    id: shortid.generate(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    isAdmin: false,
    wrongLoginCount: 0,
    avatarUrl: '/avatar_default.jpg'
  };
  db.get("users")
    .push(user)
    .write();
  res.redirect("/users");
};

module.exports.getUserId = (req, res) => {
  const user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  res.render("edit_user", { user: user });
};

module.exports.postUserId = (req, res) => {
  db.get("users")
    .find({ id: req.params.id })
    .assign({ name: req.body.name, phone: req.body.phone })
    .write();
  res.redirect("/users");
};
module.exports.getUserIdToDelete = (req, res) => {
  db.get("users")
    .remove({ id: req.params.id })
    .write();
  res.redirect("/users");
};
module.exports.getProfileUser = (req, res) => {
  const user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value()
  res.render('profile', {
    user: user
  })
}
module.exports.getUpdateAvatar = (req, res) => {

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_CLOUD_KEY,
    api_secret: process.env.API_SECRET_CLOUD_KEY
  })
  res.render('update_avatar')
}
module.exports.postUpdateAvatar = (req, res) => {
  cloudinary.uploader.upload(req.file.path, function(error, result) { 
    //console.log(result.url) 
    db.get('users')
      .find({id: req.signedCookies.userId})
      .assign({avatarUrl: result.url})
      .write()
  })
  res.redirect('/users/profile')
}