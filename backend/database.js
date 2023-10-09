require('dotenv').config()
var mysql = require("mysql2")

var connection = mysql.createConnection(
    {

        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.USERNAME,
        password: process.env.PASSWORDASSET_MYSQL

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
