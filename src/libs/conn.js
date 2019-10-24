/*jshint esversion: 9, node: true */

const mysql = require('mysql');
const config = require('./config/config.js');

const con = mysql.createConnection(config.dataBaseConfig);

con.connect(function(err) {
  if (err) {
    console.log(err);
    console.log('Error connecting to Db');
    return;
  }
  console.log('Database connected');
});

function select(query, callback) {
  con.query(query, function(err, rows) {
    if (err) throw err;
    return callback(rows);
  });
}

function insert(query, callback) {
  con.query(query, function(err, rows) {
    if (err) throw err;
    return "1 linha inserida";
  });
}


module.exports = {
  select: select,
  insert: insert
};
