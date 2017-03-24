//replace 'MYSQL_HOST_NAME' and 'MYSQL_DATABASE_NAME' with mysql hostname & database name
//replace 'MYSQL_USER_NAME' and 'MYSQL_PASSWORD' with mysql username & password
//then rename this file to 'dbconfig.js' (without quotes, of course!)
//this is used when connecting to mySQL database

module.exports = {
        host    :   'MYSQL_HOST_NAME',
        database:   'MYSQL_DATABASE_NAME',
        user    :   'MYSQL_USER_NAME', 
        password:   'MYSQL_PASSWORD'
};