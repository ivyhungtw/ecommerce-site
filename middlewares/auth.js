const helpers = require('../test_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/user/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.redirect('/') 
  }
  res.redirect('/user/login')
}

const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/user/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}