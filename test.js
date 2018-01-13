const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request  = require("supertest");
const app = require('./app');

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

describe('User Profile', function() {
  it('Login should redirect to user page', function(done){
    chai.request(app)
    .post('/')
    .send({ username: process.env.username, password: process.env.password})
    .then(function (res) {
    // expect(res).to.have.cookie('sessionid');
    expect(res).to.have.status(200);
    done();
    });
  });
});
