var dashboardView = require('../views/dashboard_view')
var assert = require('assert');

describe("dashboardView", function() {
  it("returns the data for the dashboard page", function() {
    var kids = [
      {
        child_first_name: "Lenny",
        child_last_name: "Socrates",
        mother_first_name: "Pam",
        mother_last_name:"Socrates",
        father_first_name: "Gil",
        father_last_name: "Socrates",
        birthday: new Date(2014, 1, 1),
        enrollment_date: new Date(2016, 1, 1),
        departure_date: null,
        attends_monday: true,
        attends_tuesday: false,
        attends_wednesday: true,
        attends_thursday: false,
        attends_friday: true
      },
      {
        child_first_name: "Jimmy",
        child_last_name: "Socrates",
        mother_first_name: "Pam",
        mother_last_name:"Socrates",
        father_first_name: "Gil",
        father_last_name: "Socrates",
        birthday: new Date(2013, 5, 15),
        enrollment_date: new Date(2015, 1, 1),
        departure_date: null,
        attends_monday: true,
        attends_tuesday: true,
        attends_wednesday: true,
        attends_thursday: true,
        attends_friday: true
      },
    ];

    var query = {};

    var view = dashboardView(kids, new Date(2016, 3, 4), query);
    assert.equal(view.kids.length, 2);
    assert.equal(view.kids[0].ageInYears, 2);
    assert.equal(view.kids[0].ageInMonths, 2);
    assert.equal(view.mondayCount, 2);
    assert.equal(view.tuesdayCount, 1);
    assert.equal(view.wednesdayCount, 2);
    assert.equal(view.thursdayCount, 1);
    assert.equal(view.fridayCount, 2);
  });
})
