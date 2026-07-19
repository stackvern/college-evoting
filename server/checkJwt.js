require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const register_number = process.argv[2];
const email = process.argv[3];
if (!register_number || !email) {
  console.error('Usage: node checkJwt.js <register_number> <email>');
  process.exit(1);
}
axios.post('http://localhost:5000/api/student/login', {
  register_number,
  email
})
.then(response => {
  console.log('LOGIN RESPONSE', response.data);
  const token = response.data.token;
  if (!token) return;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('DECODED TOKEN', decoded);
})
.catch(err => {
  if (err.response) {
    console.error('ERROR STATUS', err.response.status, err.response.data);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});
