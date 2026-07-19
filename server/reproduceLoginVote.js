require('dotenv').config();
const http = require('http');

const register_number = process.argv[2];
const email = process.argv[3];

if (!register_number || !email) {
  console.error('Usage: node reproduceLoginVote.js <register_number> <email>');
  process.exit(1);
}

const loginPayload = JSON.stringify({ register_number, email });
const loginOptions = {
  host: 'localhost',
  port: 5000,
  path: '/api/student/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginPayload)
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let loginData = '';
  loginRes.on('data', (chunk) => loginData += chunk);
  loginRes.on('end', () => {
    console.log('LOGIN STATUS', loginRes.statusCode);
    console.log(loginData);

    try {
      const parsed = JSON.parse(loginData);
      if (!parsed.token) return;
      const token = parsed.token;
      const votePayload = JSON.stringify({ presidentId: 2, secretaryId: 5, treasurerId: 3 });
      const voteOptions = {
        host: 'localhost',
        port: 5000,
        path: '/api/student/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(votePayload),
          Authorization: 'Bearer ' + token
        }
      };
      const voteReq = http.request(voteOptions, (voteRes) => {
        let voteData = '';
        voteRes.on('data', (chunk) => voteData += chunk);
        voteRes.on('end', () => {
          console.log('VOTE STATUS', voteRes.statusCode);
          console.log(voteData);
        });
      });
      voteReq.write(votePayload);
      voteReq.end();
    } catch (e) {
      console.error('PARSE ERR', e);
    }
  });
});
loginReq.write(loginPayload);
loginReq.end();
