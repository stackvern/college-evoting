require('dotenv').config();
const db = require('./config/db');
db.query('DESCRIBE votes', (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.table(rows);
  process.exit(0);
});
