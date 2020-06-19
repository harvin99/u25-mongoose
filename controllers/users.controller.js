const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2

const User = require('../models/users.model')

module.exports.getUser = async (req, res) => {
  try {
  const user = await User.findById({_id: req.signedCookies.userId})
  var page = parseInt(req.query.page) || 1
  const perPage = 8

  var start = (page - 1)* perPage
  var end = page * perPage
  //var items = db.get("users").value().slice(start, end)
  var users = await User.find()
  var items = users.slice(start, end)

  if (user.isAdmin) {
    res.render("users", {
      users: items,
      currenPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      countUser: users.length,
      isAdmin: true
    });
  }
  else{
    res.render("users", {
      users: user,
      countUser: 1
    })
  }
  } catch (error) {
    console.log(error.message)
  }
};
module.exports.createUser = (req, res) => {
  res.render("create_user");
};
module.exports.postCreateUser = async (req, res) => {
  try {
      const existEmailUser = await User.findOne({ email: req.body.email })
    if (existEmailUser) {
      res.render("create_user", {
        values: req.body,
        errors: ["Email was exist !"]
      });
      return;
    }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    let user = new User()

    user.name = req.body.name
    user.email = req.body.email
    user.phone = req.body.phone
    user.password = hashedPassword
    user.isAdmin = false
    user.wrongLoginCount = 0
    user.avatarUrl = '/avatar_default.jpg'

    user.save(function(error){
      if(error)
        return console.error(error)
      else
      res.redirect("/users");
    })
    
  } catch (error) {
    console.log(error.message)
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    const user = await User.findById({_id: req.params.id})
    res.render("edit_user", { user: user });
  } catch (error) {
    console.log(error.message)
  }
};

module.exports.postUserId = async (req, res) => {
  try {
    const resultUser = await User.findByIdAndUpdate(req.params.id, 
                    { name: req.body.name, phone: req.body.phone })
    res.redirect("/users");
  } catch (error) {
    console.log(error.message)
  }
};
module.exports.getUserIdToDelete = async (req, res) => {
  try {
    const resultUser = await User.findByIdAndDelete(req.params.id)
    res.redirect("/users");
  } catch (error) {
    console.log(error.message)
  }
};
module.exports.getProfileUser = async (req, res) => {
  try {
    const user = await User.findById({ id: req.signedCookies.userId })
    res.render('profile', {
      user: user
  })
  } catch (error) {
    console.log(error.message)
  }
}
module.exports.getUpdateAvatar = (req, res) => {

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_CLOUD_KEY,
    api_secret: process.env.API_SECRET_CLOUD_KEY
  })
  res.render('update_avatar')
}
module.exports.postUpdateAvatar =  (req, res) => {
    cloudinary.uploader.upload(req.file.path, async function(error, result) { 
      try {
        
        const resultUser = await User.findByIdAndUpdate(req.signedCookies.userId, 
          {avatarUrl: result.url})
      } catch (error) {
        console.log(error.message)
      }
    })
    res.redirect('/users/profile')
}