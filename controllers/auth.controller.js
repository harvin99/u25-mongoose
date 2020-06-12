
const bcrypt = require('bcrypt')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.DEMO_API_KEY)

const User = require('../models/users.model')

module.exports.login = (req, res) => {
  res.render('auth/login')
}
module.exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    
    //const user = db.get('users').find({email: email}).value()
    const user = await User.findOne({email: email})
    if(!user){
      res.render('auth/login', {
        errors: [
          'User does not exist.',
        ],
        values: req.body
      })
      return
    }
  
    if(user.wrongLoginCount >= 4){
      res.render('auth/login', {
        errors: [
          'Input wrong password too more, Lock login'
        ],
        values: req.body
      })
      const msg = {
        to: 'rautrang272@gmail.com',
        from: 'hungtx1001@gmail.com',
        subject: 'Lock Account !',
        text: 'Wrong password too more than 3 times !',
        html: '<strong>Wrong password too more than 3 times !</strong>',
      };
      sgMail
        .send(msg)
        .then(() => {}, error => {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
        });
        return
      }
      if(!await bcrypt.compare(password, user.password)){
        // db.get('users').find({id: user.id})
        //   .assign({wrongLoginCount: user.wrongLoginCount + 1})
        //   .write()
        const resultUser = await User.findByIdAndUpdate(user.id, 
                      {wrongLoginCount: user.wrongLoginCount + 1})
        res.render('auth/login', {
          errors: [
            'Wrong password'
          ],
          values: req.body
        })
      return 
    }

    res.cookie('userId', user.id, {
      signed: true
    })
    res.redirect('/users')
  } catch (error) {
    console.log(error.message)
  }
}
