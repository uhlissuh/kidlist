var database = require('../database.js');
var assert = require('assert');

describe("createUser", function() {
  it("inserts user information into the age groups table", function(done) {
    database.createUser({
      "first_name": "alissa",
      "last_name": "sobo",
      "biz_name": "flower daycare",
      "city": "Arcata",
      "state": "California",
      "email": "alissa@flowerdaycare.com",
      "password": "windsong",
      "ageGroups":[
        {"min_age": '0', "max_age": '6', "max_child_count": '43'},
        {"min_age": '6', "max_age": '18', "max_child_count": '43'}
      ]
    }, function(err, id) {
      assert.equal(err, null);
      database.getAgeGroups(id, function(err, ageGroups){
        assert.equal(ageGroups[0]["min_age"], '0');
        assert.equal(ageGroups[1]["min_age"], '6');
        done();
      });
    });
  });
});

describe("createKid", function() {
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
      "departure_date": new Date(2016, 09, 25)
    }, function(err) {
      assert.equal(err, null);
      database.getKids(32, function(err, kids) {
        assert.equal(err, null);
        assert.equal(kids[0].child_first_name, "Jimmy");
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
      "password": "windsong",
      "ageGroups":[
        {"min_age": '0', "max_age": '6', "max_child_count": '43'},
        {"min_age": '6', "max_age": '18', "max_child_count": '43'}
        ]
    }, function(err) {
      database.signInUser({
        "email": "alissa@flowerdaycare.com",
        "password": "windsong"
      }, function(err, id) {
        assert.equal(typeof id, "number");
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
