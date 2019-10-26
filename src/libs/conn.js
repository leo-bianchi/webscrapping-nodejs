const mysql = require('mysql');

const con =  mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "white_cheese",
        port: 3306
        });

con.connect(function(err) {
    if(err){
        console.log(err);
        console.log('Error connecting to Db');
        return;
      }
  console.log('Database connected');
});

function select(query, callback) {
    con.query(query,function(err,rows){
        if(err) throw err;
        return callback(rows);
    });
}

function insert(query, callback) {
    con.query(query,function(err,rows){
        if(err) throw err;
        return callback(rows);
    });
}


module.exports =
{
    select : select,
    insert: insert
}
