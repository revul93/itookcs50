// modules
const express = require('express');
const helmet = require('helmet');
const path = require('path');

// express middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { setAuth } = require('./middleware');

// setting env file
require('dotenv').config();

// db connect module
const { dbConnect } = require('./sequelize');

// app config
const app = express();
const router = require('./router');
app.set('view engine', 'pug');
app.locals.pretty = true;
// use middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https',
          'cdn.jsdelivr.net',
          'code.jquery.com',
          'unpkg.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https', 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", '*.githubusercontent.com'],
        fontSrc: ['cdn.jsdelivr.net'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(setAuth);

app.use('/', router);

const HOST = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

// connect to db then run server
dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
  });
});
