const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
process.log = {}

const User = require('../models/user.schema')

//const { generateUser } = require('./fixtures/user')
const app = require('../app')
const request = supertest(app)

//const user = generateUser()

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

beforeAll(async (done) => {
  mongoose
    .connect(process.env.DB_TESTING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      // console.log('connected')
    })
    .catch(err => console.error(err))
  await removeAllCollections()
  done()
})

// Connection should be close, otherwise jest will show a warning
// see https://github.com/facebook/jest/issues/7092#issuecomment-429049494

// Disconnect Mongoose
afterAll(async (done) => {
  await dropAllCollections()
  await mongoose.connection.close()
  done()
})

describe('User endpoint', () => {
  it('Create a new user', async done => {
    const user = {
        full_name: "user testing",
        email: "test1@mail.com",
        password: "1234567",
        password_confirmation: "1234567",
        bio: "bio",
        gender: "Male",
        address: "address"
    }
    const res = await request.post('/api/user')
      .send(Object.assign(user, { role: 'superuser' }))

    const { status, data } = res.body

    // expect(data.full_name).toBe(`${user.first_name} ${user.last_name}`)

    expect(status).toBe(true)
    expect(res.statusCode).toEqual(201)
    expect(typeof data).toEqual('object')
    expect(data).toHaveProperty('token')
    done()
  })


})



/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const expected = chai.expect;

const app = require('../app');
const User = require('../models/user.schema');

chai.use(chaiHttp);

var testName = 'Reza Nirvana Pratama';
var testEmail = 'ezanirvana@gmail.com';
var testPassword = bcrypt.hashSync('12345', 10);
var token;
var verifyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTViY2QzZWI0NDg2YzVkNDg5NDQyMWEiLCJwcml2aWxlZ2UiOmZhbHNlLCJpYXQiOjE1ODMwNzQ5NDd9.aJSKI_O0fViMk5Btz2BrWLqDsuo1UzahgJ4gJ-vau_E';

describe('USER', () => {
    before(done => {
        User.deleteMany({}, err => {
            done()
        })
    });
    it('should create new user', done => {
        chai.request(app)
            .post('/api/user/register')
            .send({
                name: testName,
                email: testEmail,
                password: testPassword,
                password_confirmation: testPassword
            })
            .end((err, res) => {
                token = res.body.data.token
                expected(res.status).eql(201)
                done()
            })
    });
    it('activate user', done => {
        chai.request(app)
            .get(`/api/user/activation/${token}`)
            .end((err, res) => {
                expected(res.status).eql(201)
                done();
            })
    })
    it('should not create new user cause user has been registered', done => {
        chai.request(app)
            .post('/api/user/register')
            .send({
                name: testName,
                email: testEmail,
                password: testPassword,
                password_confirmation: testPassword
            })
            .end((err, res) => {
                expected(res.status).eql(422)
                done()
            })
    });
    it('should not create new user cause password does not match', done => {
        chai.request(app)
            .post('/api/user/register')
            .send({
                name: testName,
                email: testEmail,
                password: testPassword,
                password_confirmation: 'errorPassword'
            })
            .end((err, res) => {
                expected(res.status).eql(422)
                done()
            })
    });
    it('should login user', done => {
        chai.request(app)
            .post('/api/user/login')
            .send({
                email: testEmail,
                password: testPassword,
            })
            .end((err, res) => {
                token = res.body.data.token
                expected(res.status).eql(200)
                done()
            })
    });
    it('should not success login with not existing user', done => {
        chai
            .request(app)
            .post('/api/user/login')
            .send({
                email: 'testEmail',
                password: 'errorPassword'
            })
            .end(function (err, res) {
                expected(res.status).eq(403)
                done()
            })
    });
    it('should not success login with wrong password', done => {
        chai
            .request(app)
            .post('/api/user/login')
            .send({
                email: testEmail,
                password: 'errorPassword'
            })
            .end(function (err, res) {
                expected(res.status).eq(403)
                done()
            })
    });
    it('forgot password', done => {
        chai.request(app)
            .post('/api/user/forgotPassword')
            .send({
                email: testEmail
            })
            .end((err, res) => {
                token = res.body.data;
                expected(res.status).eql(200)
                done()
            })
    });
    it('reset password', done => {
        chai.request(app)
        .put(`/api/user/resetPassword/${token}`)
        .send({
            password: 'newpassword',
            password_confirmation: 'newpassword'
        })
        .end((err, res) => {
            token = res.body.data.token;
            password = res.body.password;
            expected(res.status).eql(201)
            done();
        })
    })
    it('edit profile', done => {
        chai.request(app)
        .put('/api/user/updateProfile')
        .set('Authorization', verifyToken)
        .send({
            name: 'new name'
        })
        .end((err, res) => {
            expected(res.status).eql(422)
            done();
        })
    })
})
*/