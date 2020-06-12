const Session = require('../models/sessions.model')
const shortid = require("shortid");

module.exports = function (req, res, next) {
    if (!req.signedCookies.sessionId) {
      let session = new Session()
      session.id = shortid.generate(12)
      res.cookie("sessionId", session.id, {
        signed: true,
      });
      //db.get("sessions").push({ id: sessionId }).write();
      session.save(function(error){
        if(error)
          return console.error(error)
      })
    }
    next();
};
