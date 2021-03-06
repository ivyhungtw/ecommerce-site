const userService = require('../../services/userService')

const userController = {
  login: (req, res) => {
    userService.login(req, res, data => {
      return res.json(data)
    })
  },
  register: (req, res) => {
    userService.register(req, res, data => {
      return res.json(data)
    })
  },
  getEditProfilePage: (req, res) => {
    userService.getEditProfilePage(req, res, data => {
      return res.json(data)
    })
  },
  putProfile: (req, res) => {
    userService.putProfile(req, res, data => {
      return res.json(data)
    })
  },
  putPassword: (req, res) => {
    userService.putPassword(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
