const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();
const secretKey_crypto = crypto.randomBytes(32).toString('base64');

//Use .env This file should not upload to github(.gitignore) This .env file is a secret file in our group5
const secretKey = process.env.SECRET_KEY || secretKey_crypto;

console.log(`Generated secretKey: ${secretKey}`);

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const payload = { 
     email: req.body.email,
     role: getUserRole(email), 
     exp: Math.floor(Date.now()/1000) + (60*60)// 1h (3600 sec): converts the timestamp from milliseconds to seconds and 60 second * X minuts
      };

  const token = jwt.sign(
      payload,
      secretKey
      //{ expiresIn: '1h' }
    );
  console.log(`Generated JWT: ${token}`);
  
  if (isValidUser(email, password)) {
    token
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid login' });
  }
});



const isValidUser = (email, password) => {
  return email === 'user@example.com' && password === 'password';
};

const getUserRole = (email) => {
  return email === 'admin@example.com' ? 'admin' : 'user';
};

module.exports = router;