const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '64508hsYJ#*',
    database: 'directory'
});

module.exports = db;