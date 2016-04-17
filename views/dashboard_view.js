module.exports = function(kids, today, query) {
  var mondayCount = 0;
  var tuesdayCount = 0;
  var wednesdayCount = 0;
  var thursdayCount = 0;
  var fridayCount = 0;
  var waiting = query.state === 'waiting';
  var attending = !waiting;

  for(i = 0; i < kids.length; i++) {
    var wholeAge = (Date.now() - kids[i].birthday)/31557600000;
    var years = Math.floor(wholeAge);
    var months = Math.round((Math.round((wholeAge % 1) * 10) / 10) * 12)
    kids[i].ageInYears = years;
    kids[i].ageInMonths = months;

    if (kids[i].attends_monday) {
      mondayCount += 1;
    }

    if (kids[i].attends_tuesday) {
      tuesdayCount += 1;
    }

    if (kids[i].attends_wednesday) {
      wednesdayCount += 1;
    }

    if (kids[i].attends_thursday) {
      thursdayCount += 1;
    }

    if (kids[i].attends_friday) {
      fridayCount += 1;
    }
  }

  return {
    kids: kids,
    mondayCount: mondayCount,
    tuesdayCount: tuesdayCount,
    wednesdayCount: wednesdayCount,
    thursdayCount: thursdayCount,
    fridayCount: fridayCount,
    attending: attending,
    waiting: waiting
  };
}
