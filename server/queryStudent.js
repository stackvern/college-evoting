require('dotenv').config();
const db = require('./config/db');
const register_number = process.argv[2];
const email = process.argv[3];

if (!register_number || !email) {
  console.error('Usage: node queryStudent.js <register_number> <email>');
  process.exit(1);
}

const sql = 'SELECT id, register_number, email, has_voted FROM students WHERE register_number = ? AND email = ?';

db.query(sql, [register_number, email], (err, rows) => {
  if (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
  console.table(rows);
  process.exit(0);
});
