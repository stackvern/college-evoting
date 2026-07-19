require('dotenv').config();
const db = require('./config/db');
const sql = 'INSERT INTO votes (student_id, candidate_id, position_id) VALUES (?,?,?)';
const params = [5, 2, 1];
console.log('INSERT PARAMS', params);
db.query(sql, params, (err, result) => {
  if (err) {
    console.error('INSERT ERROR', err);
    process.exit(1);
  }
  console.log('RESULT', result);
  process.exit(0);
});
