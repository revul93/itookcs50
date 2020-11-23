const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const { User, Thought } = require('./sequelize');
require('dotenv').config();

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  res.cookie('history', '/home');
  res.render('index', { title: 'Home', user: req.user });
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

    const jwtPayload = {
      login: data.login,
      name: data.name,
      github_page: data.html_url,
      email: data.email,
      profile_pic: data.avatar_url,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: 3000,
    });

    let user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        github_profile: data.html_url,
        profile_picture: data.avatar_url,
      });
    }
    res.cookie('token', jwtToken);
    res.redirect(req.cookies['history'] || '/home');
  } catch (error) {
    console.error(chalk.red(`${error}`, error));
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/home');
});

router.get('/graduates', (req, res) => {
  res.cookie('history', '/graduates');
  res.render('index', { title: 'Graduates', user: req.user });
});

router.get('/thoughts', async (req, res) => {
  try {
    let thoughts = await Thought.findAll();
    res.cookie('history', '/thoughts');
    res.render('thoughts', {
      title: 'Thoughts',
      user: req.user,
      thoughts: thoughts.map((thought) => thought.toJSON()),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'SERVER ERROR!' });
  }
});

router.get('/shareThought', (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: 'NOT Authorized' });
  }
  res.render('shareThought', { title: 'Share Thought', user: req.user });
});

router.post('/shareThought', async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: 'NOT Authorized' });
  }

  const { subject, text } = req.body;
  if (!subject || !text) {
    return res.status(401).json({ message: 'Error. Required field is empty' });
  }

  try {
    let user = await User.findOne({ where: { email: req.user.email } });
    let thought = await Thought.create({
      subject,
      text,
      UserId: user.id,
    });
    return res.json({ message: 'SUCCESS' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'SERVER ERROR!' });
  }
});

router.get('/*', (req, res) => {
  res.send('NOT IMPLEMENTED YET');
});

module.exports = router;
