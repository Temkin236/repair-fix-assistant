// Minimal Express router for /auth
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ token: 'dummy-token', user: { id: '1', name: 'Test User', email: req.body.email } });
});

router.post('/register', (req, res) => {
  res.json({ token: 'dummy-token', user: { id: '1', name: req.body.name, email: req.body.email } });
});

module.exports = router;
