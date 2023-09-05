var mysql = require("mysql2")

var connection = mysql.createConnection(
    {
        
        host: 'localhost',
        database: 'assets',
        user: 'root',
        password: 'Aa123456_'
    });
/*
// Global US
        host: 'AnacondaDev.mysql.pythonanywhere-services.com',
        database: 'MySQL: AnacondaDev$assets',
        user: 'AnacondaDev',
        password: 'Kvfde34dfg436'
    }
);
*/
module.exports = connection;
