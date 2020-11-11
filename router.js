const router = require('express').Router();
const axios = require('axios');
const chalk = require('chalk');
require('dotenv').config();

let user = null;
let gh_token = '';

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  console.log(user);

  res.render('index', { user });
});

router.get('/ghlogin', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

router.get('/login', async (req, res) => {
  const code = req.query.code;

  try {
    const {
      data: { access_token },
    } = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: `http://${process.env.HOST}:${process.env.PORT}/login/github`,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    gh_token = access_token;
    user = data;
    res.redirect('home');
  } catch (error) {
    console.error(chalk.red(`${error.response.status}`, error));
  }
});

router.get('/logout', (req, res) => {
  user = null;
  gh_token = '';
  res.redirect('/home');
});

router.get('/*', (req, res) => {
  res.send('NOT IMPLEMENTED YET');
});

module.exports = router;
