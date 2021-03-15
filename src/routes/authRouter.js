const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { githubLogin, githubGetUser } = require('../logic/githubServices');
const { registerUser } = require('../logic/userActions');

router.get('/login', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

router.get('/login/github', async (req, res) => {
  const {
    query: { code },
  } = req;

  try {
    // get access token from github
    const accessToken = await githubLogin(code);

    // get github user data
    const githubUser = await githubGetUser(accessToken);

    // get user from db, or register if not exist
    let user =
      (await prisma.user.findUnique({
        where: { email: githubUser.email },
      })) || (await registerUser(githubUser));

    // generate jwt token
    const jwtToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: 3000,
    });

    // save token in cookies
    res.cookie('token', jwtToken);

    // redirect to referrer url or /home
    res.redirect(req.cookies['history'] || '/home');
  } catch (error) {
    console.error(
      chalk.red(
        `Error while processing github login request\n\t${chalk.bold(error)}`,
      ),
    );
    return res.status(500).json({ error: error.message });
  }
});

router.get('/logout', (req, res) => {
  // clear cookies when logout
  res.clearCookie('token').clearCookie('history');
  res.redirect('/home');
});

module.exports = router;
