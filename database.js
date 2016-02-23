var pg = require('pg');
var bcrypt = require("bcrypt");
var squel = require("squel");

var SALT = '$2a$10$pmAjS4LJeLKXhKC9GutBl.';

var conString = null;
exports.setURL = function(url) {
  conString = url;
};

exports.createUser = function(data, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      callback(err);
      return;
    }

    bcrypt.hash(data.password, SALT, function(err, hash) {
      client.query(
        "insert into users (first_name, last_name, name_business, city, state, email, password_hash) values ($1, $2, $3, $4, $5, $6, $7) returning id",
        [data.first_name, data.last_name, data.biz_name, data.city, data.state, data.email, hash],
        function(err, result) {
          callback(err, result.rows[0].id);
          done();
        }
      );
    });
  });
}

exports.createKid = function(userId, data, callback) {
  var days_attending = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
  }

  for (var i = 0; i < data.days_attending.length; i++) {
    days_attending[data.days_attending[i]] = true;
  }

  pg.connect(conString, function(err, client, done) {
    if (err) {
      done();
      callback(err);
      return;
    }
    client.query(
      "insert into kids (user_id, child_first_name, child_last_name, mother_first_name, mother_last_name," +
      "father_first_name, father_last_name, birthday, enrollment_date, departure_date," +
      "attends_monday, attends_tuesday, attends_wednesday, attends_thursday, attends_friday)" +
      "values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
      [userId, data.child_first_name, data.child_last_name, data.mother_first_name,
      data.mother_last_name, data.father_first_name, data.father_last_name,
      data.birthday, data.enrollment_date, data.departure_date,
      days_attending.monday, days_attending.tuesday, days_attending.wednesday, days_attending.thursday, days_attending.friday],
      function(err) {
          callback(err);
          done();
      }
    );
  });
}

exports.getKids = function(userId, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      done();
      callback(err);
      return;
    }

    client.query(
      "select * from kids where user_id=$1",
      [userId],
      function(err, result) {
        done();

        if (err) {
          callback(err);
          return;
        }

        callback(err, result.rows);
      }
    );
  });
}

exports.signInUser = function(data, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      done();
      callback(err);
      return;
    }

    client.query(
      "select * from users where email=$1 limit 1",
      [data.email],
      function(err, result) {
        done();

        if (err) {
          callback(err);
          return;
        }

        if (result.rows.length === 0) {
          callback(null, null);
        } else {
          bcrypt.compare(data.password, result.rows[0].password_hash, function(err, matches) {
            if (matches) {
              var id = result.rows[0].id;
              callback(err, id);
            } else {
              callback(err, null);
            }
          });
        }
      }
    )
  });
}

exports.truncate = function(callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      done();
      callback(err);
      return;
    }

    client.query(
      "truncate table users",
      function(err) {
        if (err) {
          done();
          callback(err);
          return;
        }

        client.query(
          "truncate table kids",
          function(err) {
            done();
            callback(err);
          }
        );
      }
    );
  });
}
