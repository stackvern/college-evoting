require('dotenv').config();
const db = require('./config/db');
const studentId = 6;
const presidentId = 2;
const secretaryId = 5;
const treasurerId = 3;
const presidentPositionId = 1;
const secretaryPositionId = 2;
const treasurerPositionId = 3;

db.beginTransaction((err) => {
  if (err) {
    console.error('BEGIN TX ERROR', err);
    process.exit(1);
  }
  const voteSQL = 'INSERT INTO votes (student_id,candidate_id,position_id) VALUES (?,?,?)';
  db.query(voteSQL, [studentId, presidentId, presidentPositionId], (err) => {
    if (err) {
      console.error('PRESIDENT ERROR', err);
      return db.rollback(() => process.exit(1));
    }
    db.query(voteSQL, [studentId, secretaryId, secretaryPositionId], (err) => {
      if (err) {
        console.error('SECRETARY ERROR', err);
        return db.rollback(() => process.exit(1));
      }
      db.query(voteSQL, [studentId, treasurerId, treasurerPositionId], (err) => {
        if (err) {
          console.error('TREASURER ERROR', err);
          return db.rollback(() => process.exit(1));
        }
        db.commit((err) => {
          if (err) {
            console.error('COMMIT ERROR', err);
            return db.rollback(() => process.exit(1));
          }
          console.log('SUCCESS');
          process.exit(0);
        });
      });
    });
  });
});
