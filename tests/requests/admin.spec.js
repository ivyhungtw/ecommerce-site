const request = require('supertest')
const app = require('../../app')
const chai = require('chai')
const sinon = require('sinon')
chai.use(require('sinon-chai'))
const { expect } = require('chai')
const should = chai.should()
const passport = require('../../config/passport')
const helpers = require('../../test_helpers')

const db = require('../../models')

describe('# Admin Requests', () => {

  // admin pages
  context('# GET', () => {

    // product pages
    describe('GET /admin/products', () => {

      before(async() => {
        await db.User.destroy({ where: {}, truncate: { cascade: true } })
        await db.Order.destroy({ where: {}, truncate: { cascade: true } })
        await db.Product.destroy({ where: {}, truncate: { cascade: true } })
        await db.Category.destroy({ where: {}, truncate: { cascade: true } })

        const rootUser = await db.User.create({
          id: 1,
          name: '123',
          email: '123@gmail.com',
          password: '123',
          role: 'admin'
        })
        this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
          callback(null, {...rootUser}, null)
          return (req,res,next) => {}
        })
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, role: 'admin' })

        await db.Category.create({ id: 1, name: 'test1' })
        await db.Category.create({ id: 2, name: 'test2' })
        await db.Product.create({
          id: 1,
          CategoryId: 1,
          name: 'test1',
          price: 500,
          description: 'test1 detail',
          quantity: 1,
          image:
            'https://www.collinsdictionary.com/images/full/dress_31690953_1000.jpg'
        })
        await db.Product.create({
          id: 2,
          CategoryId: 2,
          name: 'test2',
          price: 500,
          description: 'test2 detail',
          quantity: 1,
          image:
            'https://www.collinsdictionary.com/images/full/dress_31690953_1000.jpg'
        })
      })

      // GET /admin/products
      it('can render admin index', done => {
        request(app)
          .get('/admin/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('test1')
            res.text.should.include('test2')
            return done()
          })
      })

      // GET /api/admin/products
      it(' - successfully', done => {
        request(app)
          .get('/api/admin/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.products[0].name.should.equal('test2')
            res.body.products[1].name.should.equal('test1')
            return done()
          })
      })
    })

    describe('GET /admin/products/:id', () => {
      // GET /admin/products/:id
      it('can see product description', done => {
        request(app)
          .get('/admin/products/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('test1 detail')
            return done()
          })
      })

      // GET /api/admin/products/:id
      it(' - successfully', done => {
        request(app)
          .get('/api/admin/products/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.product.description.should.equal('test1 detail')
            return done()
          })
      })
    })

    describe('GET /admin/products/:id/edit', () => {
      // GET /admin/products/:id/edit
      it('can render admin product edit page', done => {
        request(app)
          .get('/admin/products/1/edit')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('test1 detail')
            return done()
          })
      })

      // GET /api/admin/products/:id/edit
      it(' - successfully', done => {
        request(app)
          .get('/api/admin/products/1/edit')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.product.description.should.equal('test1 detail')
            return done()
          })
      })
    })

    describe('GET /admin/products/create', () => {

      // GET /admin/products/create
      it('can render admin create product page', done => {
        request(app)
          .get('/admin/products/create')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('name')
            res.text.should.include('category')            
            res.text.should.include('price')
            res.text.should.include('quantity')
            res.text.should.include('description')
            return done()
          })
      })

      // GET /api/admin/products/:id/edit
      it(' - successfully', done => {
        request(app)
          .get('/api/admin/products/create')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.categories[0].id.should.equal(1)
            res.body.categories[0].name.should.equal('test1')
            return done()
          })
      })
    })
    
    after(async () => {
      this.authenticate.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Category.destroy({ where: {}, truncate: { cascade: true } })
    })
  })
})

context('# POST', () => {
  // POST /admin/products
  describe('POST /admin/products', () => {
    before(async() => {
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Category.destroy({ where: {}, truncate: { cascade: true } })

      const rootUser = await db.User.create({
        id: 1,
        name: '123',
        email: '123@gmail.com',
        password: '123',
        role: 'admin'
      })
      this.authenticate =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
        callback(null, {...rootUser}, null)
        return (req,res,next) => {}
      })
      // this.ensureAuthenticated = sinon.stub(
      //   helpers, 'ensureAuthenticated'
      // ).returns(true)
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, role: 'admin' })
      
      await db.Category.create({ id: 1, name: 'test1' })
      await db.Product.create({
        id: 1, 
        CategoryId: 1,
        name: 'test1',
        price: 10,
        quantity: 10,
        description: 'test1 detail'
      })
    })

    it('will redirect to index', (done) => {
      request(app)
        .post('/admin/products')
        .send('description=description')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err)
          return done()
        })
    })

    it('can create new product', async () => {
      const product = await db.Product.findOne({ where: { CategoryId: 1 }})
      console.log('========product: ', product)
      expect(product).to.not.be.null
    })

    after(async () => {    
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true }})
      await db.Product.destroy({ where: {}, truncate: { cascade: true }})
    })
  })
})