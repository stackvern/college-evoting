const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database Connection Failed");
    console.log(err);
    return;
  }

  console.log("✅ MySQL Connected Successfully");
});

module.exports = db;