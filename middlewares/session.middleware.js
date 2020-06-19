const Session = require('../models/sessions.model')
const ObjectID = require('mongodb').ObjectID
module.exports = function (req, res, next) {
    if (!req.signedCookies.sessionId) {
      //console.log(req.signedCookies.sessionId)
      let session = new Session()
      session._id = new ObjectID()
      res.cookie("sessionId", session.id, {
        signed: true,
      });

      session.save(function(error){
        if(error)
          return console.error(error)
      })
    }
    next();
};
