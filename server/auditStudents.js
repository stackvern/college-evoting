require('dotenv').config();
const db = require('./config/db');
const queries = [
  {name:'duplicate_register', sql:'SELECT register_number, COUNT(*) AS cnt FROM students GROUP BY register_number HAVING cnt > 1'},
  {name:'duplicate_email', sql:'SELECT email, COUNT(*) AS cnt FROM students GROUP BY email HAVING cnt > 1'},
  {name:'duplicate_id', sql:'SELECT id, COUNT(*) AS cnt FROM students GROUP BY id HAVING cnt > 1'},
  {name:'has_voted_counts', sql:'SELECT has_voted, COUNT(*) AS cnt FROM students GROUP BY has_voted'},
  {name:'has_voted_1_zero_votes', sql:'SELECT s.id,s.register_number,s.email,s.has_voted,COALESCE(v.voteCount,0) AS voteCount FROM students s LEFT JOIN (SELECT student_id, COUNT(*) AS voteCount FROM votes GROUP BY student_id) v ON s.id=v.student_id WHERE s.has_voted=1 AND COALESCE(v.voteCount,0)=0 LIMIT 20'},
  {name:'has_voted_0_with_votes', sql:'SELECT s.id,s.register_number,s.email,s.has_voted,COALESCE(v.voteCount,0) AS voteCount FROM students s LEFT JOIN (SELECT student_id, COUNT(*) AS voteCount FROM votes GROUP BY student_id) v ON s.id=v.student_id WHERE s.has_voted=0 AND COALESCE(v.voteCount,0)>0 LIMIT 20'}
];
let i = 0;
const runNext = () => {
  if (i >= queries.length) return process.exit(0);
  const q = queries[i++];
  db.query(q.sql, (err, rows) => {
    if (err) {
      console.error(q.name, err);
      return process.exit(1);
    }
    console.log('---', q.name, '---');
    console.table(rows);
    runNext();
  });
};
runNext();
