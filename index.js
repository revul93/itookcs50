const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { dbConnect } = require('./sequelize');
const app = express();
const router = require('./router');

app.set('view engine', 'pug');

app.use(cookieParser());
app.use(express.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
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
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https', 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'https'],
        fontSrc: ['cdn.jsdelivr.net'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use((req, res, next) => {
  if ('token' in req.cookies) {
    try {
      req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    } catch (error) {
      res.clearCookie('token');
      message = `
      You are not authorized
      <a href="/ghlogin">Login</a>
      `;
      return res.status(403).send(message);
    }
  }
  next();
});

app.use('/', router);

const HOST = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://${HOST}:${PORT}`);
  });
});
