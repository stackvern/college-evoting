require('dotenv').config();
const db = require('./config/db');
const studentId = 6;

db.query('DELETE FROM votes WHERE student_id = ?', [studentId], (err, result) => {
  if (err) {
    console.error('DELETE ERROR', err);
    process.exit(1);
  }
  console.log('DELETED VOTES', result.affectedRows);
  db.query('UPDATE students SET has_voted = 0 WHERE id = ?', [studentId], (err, result) => {
    if (err) {
      console.error('UPDATE ERROR', err);
      process.exit(1);
    }
    console.log('UPDATED STUDENT', result.affectedRows);
    process.exit(0);
  });
});
