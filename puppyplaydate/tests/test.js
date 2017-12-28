const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const host = "http://localhost:3000";
const request  = require("supertest");
const agent = request.agent(host)


const credentials = {
  username: 'Radhika-Mattoo',
  password: '10213670864262036'
}
describe('Index Page', function() {
  it('should give back status 200', function(done){
  chai.request(host)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});
// describe('User Home Page', function() {
//       it('should login and redirect to user page', function(done){
//         // chai.request(host)
//         // .post('/')
//         // .set('Token', 'text/plain')
//         // .set('content-type', 'application/x-www-form-urlencoded')
//         // .type('form')
//         // .send('grant_type=password')
//         // .send('username=' + credentials.username)
//         // .send('password=' + credentials.password)
//         // .end(function(err,res){
//         //   expect(res).to.redirectTo('http://localhost:3000/users/Radhika-Mattoo');
//         //   done();
//         // });
//         agent
//         .post('/')
//         .field('username', credentials.username)
//         .field('password', credentials.password)
//         .end(function(err, res){
//           console.log(res)
//           expect(res).to.redirectTo('http://localhost:3000/users/Radhika-Mattoo');
//         });
//
//         var agent = chai.request.agent(host)
//         agent
//         .post('/')
//         .send({ username: credentials.username, password: credentials.password})
//         .then(function (res) {
//         expect(res).to.have.cookie('sessionid');
//         console.log("HIII")
//         // The `agent` now has the sessionid cookie saved, and will send it
//         // back to the server in the next request:
//         return agent.get('/users/Radhika-Mattoo')
//         .then(function (res) {
//            expect(res).to.have.status(200);
//            done()
//         });
//         });
//       });
//
// });
