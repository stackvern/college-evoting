require('dotenv').config();
const db = require('../config/db');

const tables = ['votes','settings','students','candidates'];
const query = `SELECT TABLE_NAME, COLUMN_NAME, IS_NULLABLE, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM information_schema.columns WHERE table_schema = ? AND table_name IN (?,?,?,?) ORDER BY TABLE_NAME, ORDINAL_POSITION`;
const schema = process.env.DB_NAME;

if (!schema) {
  console.error('Missing DB_NAME in environment');
  process.exit(1);
}

db.query(query, [schema, ...tables], (err, results) => {
  if (err) {
    console.error('QUERY ERR', err);
    process.exit(1);
  }
  console.table(results);
  process.exit(0);
});
