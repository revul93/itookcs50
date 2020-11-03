const express = require('express');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./sequelize');
const app = express();

app.set('view engine', 'pug');
app.use(helmet());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const HOST = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});
