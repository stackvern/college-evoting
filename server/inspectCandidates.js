require('dotenv').config();
const db = require('./config/db');
const ids = [2,5,3];

db.query('SELECT id, name, position, position_id, is_active FROM candidates WHERE id IN (?,?,?)', ids, (err, rows) => {
  if (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
  console.log('CANDIDATES:', JSON.stringify(rows, null, 2));
  process.exit(0);
});
