require('dotenv').config();
const db = require('../config/db');
const schema = process.env.DB_NAME;
if (!schema) {
  console.error('Missing DB_NAME in environment');
  process.exit(1);
}
const query = `SELECT * FROM positions LIMIT 20`;
db.query(query, (err, results) => {
  if (err) {
    console.error('QUERY ERR', err);
    process.exit(1);
  }
  console.table(results);
  process.exit(0);
});
