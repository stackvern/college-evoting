require('dotenv').config();
const db = require('./config/db');

db.query('SHOW CREATE TABLE votes', (err, rows) => {
  if (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
  console.log(rows[0]['Create Table']);
  process.exit(0);
});
