var pg = require('pg');
var conString = "postgres://alissa:@localhost/kidlist";


exports.createUser = function(data, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      callback(err);
      return;
    }


    client.query(
      "insert into users (first_name, last_name, name_business, city, state, email, password_hash) values ($1, $2, $3, $4, $5, $6, $7)",
      [data.first_name, data.last_name, data.biz_name, data.city, data.state, data.email, data.password],
      function(err, result) {
        done();
        callback(err);
      }
    );
  });
}
