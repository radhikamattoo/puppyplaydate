const expect  = require('chai').expect;
const request = require('request');

const credentials = {
  'username': 'Radhika-Mattoo',
  'password': '10213670864262036'
}

describe('Index Page', function() {
      it('should give back status 200', function(){
          request('http://localhost:8080/', function(error, response, body) {
              expect(response.statusCode).to.equal(200);
          });
      });
});

describe('User Home Page', function() {
        it('should give back status 200', function(){
            request('http://localhost:8080/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
});
