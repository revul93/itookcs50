// modules
const express = require('express');
const cookieParser = require('cookie-parser');
const helmetConfig = require('./config/helmet.config');
const path = require('path');
const router = require('./routes');
const { authenticate } = require('./middleware/auth');
require('dotenv').config();

// app configs
const app = express();
app.set('view engine', 'pug');
app.locals.pretty = true;

// app middlewares
app.use(helmetConfig());
app.use('/public', express.static(path.join(__dirname, 'pulbic')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use(authenticate);

// router
app.use('/', router);

// app init
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.listen(PORT, () => {
  console.log(`Server started at http://${HOSTNAME}:${PORT}/`);
});
