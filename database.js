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
        "insert into users (first_name, last_name, name_business, city, state, email, password_hash) values ($1, $2, $3, $4, $5, $6, $7) returning id",
        [data.first_name, data.last_name, data.biz_name, data.city, data.state, data.email, hash],
        function(err, result) {
          client.query(
            "insert into age_groups (user_id, min_age, max_age, max_child_count) values ($1, $2, $3, $4)",
            [result.rows[0]["id"], data.ageGroups[0].min_age, data.ageGroups[0].max_age, data.ageGroups[0].max_child_count],
            function(err) {
              callback(err, result.rows[0]["id"]);
              done();
            }
          );
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
          callback(err, null);
        } else {
          bcrypt.compare(data.password, result.rows[0].password_hash, function(err, res) {
            if (res === true) {
              var id = result.rows[0].id;
              callback(err, id);
            }
            done();
          });
        }
      }
    )
  });
}

exports.getAgeGroups = function(id, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return callback(err);
    }
    client.query(
      "select * from age_groups where user_id=$1",
      [id],
      function(err, result) {
        console.log(id);
        console.log(result.rows);
        callback(err, result.rows);
      }
    );
  });
};
