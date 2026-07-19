require('dotenv').config();
const db = require('./config/db');
const studentId = parseInt(process.argv[2], 10) || 6;

db.query(
  `SELECT v.id, v.student_id, v.candidate_id, v.position_id, v.voted_at, c.name AS candidate_name, c.position
   FROM votes v
   LEFT JOIN candidates c ON c.id = v.candidate_id
   WHERE v.student_id = ?
   ORDER BY v.id`,
  [studentId],
  (err, rows) => {
    if (err) {
      console.error('ERROR', err);
      process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }
);
