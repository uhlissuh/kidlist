var database = require('../database.js');
var assert = require('assert');

describe("signInUser", function() {
  it("calls the callback with the user's id if the password is correct", function(done) {
    database.createUser({
      "first_name": "alissa",
      "last_name": "sobo",
      "biz_name": "flower daycare",
      "city": "Arcata",
      "state": "California",
      "email": "alissa@flowerdaycare.com",
      "password": "windsong"
    }, function(err) {
      database.signInUser({
        "email": "alissa@flowerdaycare.com",
        "password": "windsong"
      }, function(err, id) {
        assert.equal(typeof id, "object");
        done();
      });
    });
  });

  it("calls the callback with null if the user has never joined", function(done) {
    database.signInUser({
      "email": "goat@farm.com",
      "password": "goatmilk"
    }, function(err, id) {
      assert.equal( id, null);
      done();
    });
  });
});
