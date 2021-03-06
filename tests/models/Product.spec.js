const chai = require('chai')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const ProductModel = require('../../models/product')

describe('# Product Model', () => {
  before(done => {
    done()
  })

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()

  checkModelName(Product)('Product')

  // check property
  context('properties', () => {
    ;['name', 'price', 'description', 'quantity', 'image'].forEach(checkPropertyExists(product))
  })

  // data association
  context('associations', () => {
    const CartItem = 'CartItem'
    const OrderItem = 'OrderItem'
    const Category = 'Category'
    const Cart = 'Cart'
    const Order = 'Order'
    
    before(() => {
      Product.associate({ CartItem })
      Product.associate({ OrderItem })
      Product.associate({ Category })
      Product.associate({ Cart })
      Product.associate({ Order })
    })

    it('defined a belongsToMany association with Cart', done => {
      expect(Product.belongsToMany).to.have.been.calledWith(Cart)
      done()
    })

    it('defined a belongsToMany association with Order', done => {
      expect(Product.belongsToMany).to.have.been.calledWith(Order)
      done()
    })

    it('defined a belongsTo association with category', (done) => {
      expect(Product.belongsTo).to.have.been.calledWith(Category)
      done()
    })
  })
  // check CRUD action
  context('action', () => {
    let data = null

    it('create', async function() {
      const product = await db.Product.create({ 
        CategoryId: 1, 
        name: 'test', 
        price: 500,
        description: 'test',
        quantity: 1,
        image: 'https://www.collinsdictionary.com/images/full/dress_31690953_1000.jpg'
       })
       console.log('product: ', product)
      data = product
    })

    it('read', async function() {
      const product = await db.Product.findByPk(data.id)
      expect(data.id).to.be.equal(product.id)
    })

    it('update', async function() {
      await db.Product.update({}, { where: { id: data.id }})
      const product = await db.Product.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(product.updatedAt)
    })

    it('delete', async function() {
      await db.Product.destroy({ where: { id: data.id }})
      const product = await db.Product.findByPk(data.id)
      expect(product).to.be.equal(null)
    })
  })
})
