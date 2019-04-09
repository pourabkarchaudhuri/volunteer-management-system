var mysql = require('mssql');

var config = { 
	user     : 'sa',
    password : 'P@ssw0rd123',
    server   : 'localhost',
    database : 'db',
    // user: 'hexawareadmin',
    // password: 'password123!',
    // server: 'vmshexaware.database.windows.net', 
	// database: 'VMSDBDS1',
    options: { encrypt: true}
};

var connection = new mysql.ConnectionPool(config)


module.exports = {
    mysql, connection
}