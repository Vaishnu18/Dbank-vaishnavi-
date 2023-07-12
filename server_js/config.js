// import mysql from 'mysql';
const mysql = require('mysql');

// create a connection to the database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_bank'
});

// conn.query('select * from db_bank.user' ,(err,res)=>{
//   //return console.log(res)
//   return console.log(res)
// })

// export default { conn: conn } 
module.exports = conn
