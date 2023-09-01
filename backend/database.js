var mysql = require("mysql2")

var connection = mysql.createConnection(
    {
        host: 'localhost',
        database: 'assets',
        user: 'root',
        password: 'Aa123456_'
    }
);

module.exports = connection;
