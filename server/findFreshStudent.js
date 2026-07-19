require('dotenv').config();
const db = require('./config/db');

db.query(
  `SELECT s.id, s.register_number, s.email, s.has_voted, COUNT(v.id) as votes_count
   FROM students s
   LEFT JOIN votes v ON v.student_id = s.id
   GROUP BY s.id
   HAVING s.has_voted = 0 AND votes_count = 0
   LIMIT 5`,
  (err, rows) => {
    if (err) {
      console.error('ERROR', err);
      process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }
);
