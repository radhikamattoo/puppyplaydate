const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request  = require("supertest");
const app = require('./app');

const authenticatedUser = request.agent(app);
require('dotenv').config();


describe('Home Page', function() {
  it('Should give back status 200', function(done){
  chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});

describe('Authentication', function(){
  it('Should login user and redirect to their profile', function(done){
    authenticatedUser
    .post('/')
    .send({ username: process.env.username, password: process.env.password})
    .end(function(err, res){
      expect(res).to.redirect;
      expect('Location', '/Radhika-Mattoo');
      done();
    });
  });
});
