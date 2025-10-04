<<<<<<< HEAD
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'traveldb'
  });
  module.exports = connection;

=======
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'traveldb'
});
// .promise()
  module.exports = connection;
>>>>>>> c3825673c631771d9ef7e28377b90e23a36082dd
