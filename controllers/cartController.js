const cartService = require('../services/cartService')

const cartController = {
  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      return res.redirect('back')
    })
  },
  getCart: (req, res) => {
    cartService.getCart(req, res, data => {
      return res.render('cart', data)
    })
  },
  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, data => {
      return res.redirect('back')
    })
  }
}

module.exports = cartController
