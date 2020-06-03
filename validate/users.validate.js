module.exports.validatePostCreateUser = (req, res, next) => {
  const errors = []
  if(req.body.name.length >= 30)
    errors.push('Name length is too more than 30 charaters')
  if(!req.body.name)
    errors.push('Name is required')
  if(!req.body.email)
    errors.push('Email is required')
  if(!req.body.phone)
    errors.push('Phone is required')
  if(req.body.password !== req.body.confirm_password)
    errors.push('Password is not matcched with confirm password')
  if(errors.length){
    res.render('create_user', {
      errors: errors,
      values: req.body
    })
    return
  }
  next()
}