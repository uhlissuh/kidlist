var database = require('../database.js');
var assert = require('assert');

database.setURL("postgres://alissa:@localhost/kidlist_test");

describe("createKid", function() {
  beforeEach(function(done) {
    database.truncate(done);
  });

  it("inserts a new kid into the kids table", function(done) {
    database.createKid(32, {
      "child_first_name": "Jimmy",
      "child_last_name": "Smith",
      "mother_first_name": "Lucinda",
      "mother_last_name": "Smith",
      "father_first_name": "Francis",
      "father_last_name": "Smith",
      "birthday": new Date(2015, 06, 24),
      "enrollment_date": new Date(2015, 09, 15),
      "departure_date": new Date(2016, 09, 25),
      "days_attending": ["monday", "tuesday"]
    }, function(err) {
      assert.equal(err, null);
      database.getKids(32, function(err, kids) {
        assert.equal(err, null);
        assert.equal(kids[0].child_first_name, "Jimmy");
        assert.equal(kids[0].attends_monday, true);
        assert.equal(kids[0].attends_tuesday, true);
        assert.equal(kids[0].attends_wednesday, false);
        assert.equal(kids[0].attends_thursday, false);
        assert.equal(kids[0].attends_friday, false);
        done();
      });
    });
  });
});

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
    }, function(err, createdId) {
      database.signInUser({
        "email": "alissa@flowerdaycare.com",
        "password": "windsong"
      }, function(err, id) {
        assert.equal(typeof id, "number");
        assert.equal(createdId, id);
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
