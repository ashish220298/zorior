const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database : 'employee'
  });

connection.connect((err, res) => {
    if(err) {
        console.log("Error in Database");
    }
    console.log("Mysql Is Connected Successfully");
});

module.exports = connection;
