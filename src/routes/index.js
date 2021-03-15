const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const thoughtsRouter = require('./thoughtsRouter');

router.get('/', (reg, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  res.json('home');
});

router.use(authRouter).use(thoughtsRouter);

module.exports = router;
