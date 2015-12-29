var pg = require('pg');
var conString = "postgres://alissa:@localhost/kidlist";
var bcrypt = require("bcrypt");

var SALT = '$2a$10$pmAjS4LJeLKXhKC9GutBl.';

exports.createUser = function(data, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      callback(err);
      return;
    }

    bcrypt.hash(data.password, SALT, function(err, hash) {
      client.query(
        "insert into users (first_name, last_name, name_business, city, state, email, password_hash) values ($1, $2, $3, $4, $5, $6, $7)",
        [data.first_name, data.last_name, data.biz_name, data.city, data.state, data.email, hash],
        function(err, result) {
          done();
          callback(err);
        }
      );
    });
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
          var id = null;
          callback(err, id);
        } else {
          bcrypt.compare(data.password, result.rows[0].password_hash, function(err, res) {
            if (res === true) {
              id = result.rows[0].id;
              callback(err, id);
            }
            done();
          });
        }
      }
    )
  })
}
