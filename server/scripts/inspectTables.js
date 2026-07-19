require('dotenv').config();
const db = require('../config/db');
const schema = process.env.DB_NAME;
if (!schema) {
  console.error('Missing DB_NAME in environment');
  process.exit(1);
}
const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name`;
db.query(query, [schema], (err, results) => {
  if (err) {
    console.error('QUERY ERR', err);
    process.exit(1);
  }
  console.table(results);
  process.exit(0);
});
