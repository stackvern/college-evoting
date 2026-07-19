require('dotenv').config();
const db = require('./config/db');
const register = process.argv[2] || '710124205006';

db.query(
  'SELECT id, register_number, email, has_voted FROM students WHERE register_number = ?',
  [register],
  (err, rows) => {
    if (err) {
      console.error('ERROR', err);
      process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }
);
