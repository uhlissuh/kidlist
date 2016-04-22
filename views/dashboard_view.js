module.exports = function(allKids, today, query) {
  var mondayCount = 0;
  var tuesdayCount = 0;
  var wednesdayCount = 0;
  var thursdayCount = 0;
  var fridayCount = 0;
  var waiting = query.state === 'waiting';
  var attending = !waiting;
  var kids = [];

  for(i = 0; i < allKids.length; i++) {
    var kid = allKids[i];
    var ageTotalMonths = ((today.getFullYear()- kid.birthday.getFullYear())  * 12)
     + (today.getMonth() - kid.birthday.getMonth());
    kid.ageInYears = Math.floor(ageTotalMonths / 12);
    kid.ageInMonths = ageTotalMonths % 12;

    if (query.day === 'monday' && kid.attends_monday) {
      kids.push(kid);
    } else if (query.day === 'tuesday' && kid.attends_tuesday) {
      kids.push(kid);
    }else if (query.day === 'wednesday' && kid.attends_wednesday) {
      kids.push(kid);
    } else if (query.day === 'thursday' && kid.attends_thursday) {
      kids.push(kid);
    } else if (query.day === 'friday' && kid.attends_friday) {
      kids.push(kid);
    } else if (!query.day) {
      kids.push(kid);
    }

    if (kid.attends_monday) {
      mondayCount += 1;
    }

    if (kid.attends_tuesday) {
      tuesdayCount += 1;
    }

    if (kid.attends_wednesday) {
      wednesdayCount += 1;
    }

    if (kid.attends_thursday) {
      thursdayCount += 1;
    }

    if (kid.attends_friday) {
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
