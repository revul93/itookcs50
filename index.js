const express = require('express');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const { dbConnect } = require('./sequelize');
const app = express();
const router = require('./router');

app.use(helmet());
app.set('view engine', 'pug');
app.use(express.json({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', router);

const HOST = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
  });
});
