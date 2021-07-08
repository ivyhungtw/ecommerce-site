const express = require('express')
const router = express.Router()

const productController = require('../controllers/api/productController')

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

module.exports = router
