const mysql = require('mysql');

const db = mysql.createConnection({
    host : "34.101.135.207",
    user : "root",
    password : "123456",
    database : "api_capstone"
}
);


module.exports = db;



