require('dotenv').config();
const db = require('./config/db');
const studentId = parseInt(process.argv[2], 10) || 6;

const queries = [
  { sql: 'SELECT COUNT(*) AS voteCount FROM votes WHERE student_id = ?', params: [studentId] },
  { sql: 'SELECT id, student_id, candidate_id, position_id, voted_at FROM votes WHERE student_id = ?', params: [studentId] },
  { sql: 'SELECT id, register_number, email, has_voted FROM students WHERE id = ?', params: [studentId] }
];

const runQuery = (index) => {
  if (index >= queries.length) {
    db.end();
    return;
  }
  const { sql, params } = queries[index];
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('QUERY ERROR', err);
      db.end();
      process.exit(1);
    }
    console.log('QUERY', sql, params, 'RESULT', JSON.stringify(rows, null, 2));
    runQuery(index + 1);
  });
};

runQuery(0);
