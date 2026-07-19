require('dotenv').config();
const db = require('./config/db');

db.query('SELECT id, register_number, email, has_voted FROM students LIMIT 5', (err, rows) => {
  if (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
});
