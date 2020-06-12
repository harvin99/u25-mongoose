const User = require('../models/users.model')

module.exports.requireAuth = async (req, res, next) => {
  
  try {
    if(!req.signedCookies.userId){
      res.redirect('/auth/login')
      return
    }
    //const user = db.get('users').find({id: req.signedCookies.userId}).value()
    const user = await User.findById({_id : req.signedCookies.userId})
    if(!user){
      res.redirect('/auth/login')
      return
    }
    
    res.locals.user = user;
    next()
  } catch (error) {
    console.log(error.message)
  }
}
