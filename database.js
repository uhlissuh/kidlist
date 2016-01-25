var pg = require('pg');
var conString = "postgres://alissa:@localhost/kidlist";
var bcrypt = require("bcrypt");
var squel = require("squel");

var SALT = '$2a$10$pmAjS4LJeLKXhKC9GutBl.';

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
        function(err) {
          callback(err);
          done();
        }
      );
    });
  });
}

exports.createKid = function(userId, data, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      callback(err);
      return;
    }
    client.query(
      "insert into kids (user_id, child_first_name, child_last_name, mother_first_name, mother_last_name, father_first_name, father_last_name, birthday, enrollment_date, departure_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [userId, data.child_first_name, data.child_last_name, data.mother_first_name,
      data.mother_last_name, data.father_first_name, data.father_last_name,
      data.birthday, data.enrollment_date, data.departure_date],
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
      callback(err);
      return;
    }
    client.query(
      "select * from kids where user_id=$1",
      [userId],
      function(err, result) {
        if (err) {
          callback(err);
          return;
        }
        callback(err, result.rows);
        done();
      }
    );
  });
}


exports.signInUser = function(data, callback) {
  pg.connect(conString, function(err, client, done) {
    client.query(
      "select * from users where email=$1 limit 1",
      [data.email],
      function(err, result) {
        if (err) {
          console.log(err);
        } else if (result.rows.length === 0) {
          callback(err, null);
        } else {
          bcrypt.compare(data.password, result.rows[0].password_hash, function(err, res) {
            if (res === true) {
              var id = result.rows[0].id;
              callback(err, id);
            } else {
              callback(err, null);
            }
            done();
          });
        }
      }
    )
  });
}
