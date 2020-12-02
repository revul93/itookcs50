// modules
const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');

// models
const { User, Thought } = require('./sequelize');

// middleware
const { auth } = require('./middleware');

require('dotenv').config();

// redirect to home
router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  // track history
  res.cookie('history', '/home');
  res.render('index', { title: 'Home', user: req.user });
});

// github login
router.get('/ghlogin', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

// login backend
router.get('/login', async (req, res) => {
  //get github code
  const code = req.query.code;

  try {
    // get access token based on github code
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
      },
    );

    // get user from github
    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    // check if user exist
    let user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    // register new user if it doesn't exist
    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        github_profile: data.html_url,
        profile_picture: data.avatar_url,
      });
    }

    // generate jwt token
    const jwtToken = jwt.sign({ ...user.toJSON() }, process.env.JWT_SECRET, {
      expiresIn: 3000,
    });

    // save token in cookies
    res.cookie('token', jwtToken);

    // remember history
    res.redirect(req.cookies['history'] || '/home');
  } catch (error) {
    console.error(chalk.red(error.message));
    res.status(500).json({ message: error.message });
  }
});

router.get('/logout', (req, res) => {
  // clear cookies when logout
  res.clearCookie('token');
  res.redirect('/home');
});

router.get('/graduates', (req, res) => {
  res.cookie('history', '/graduates');
  res.render('index', { title: 'Graduates', user: req.user });
});

router.get('/thoughts/:page', async (req, res) => {
  try {
    const { page } = req.params;
    let thoughtsCount = await Thought.count();
    if (page > Math.ceil(thoughtsCount / 10)) {
      throw new Error('Max page exceeded!');
    }

    let thoughts = await Thought.findAll({
      include: User,
      limit: 10,
      offset: (page - 1) * 10,
    });

    res.cookie('history', `/thoughts/${page}`);
    return res.render('thoughts', {
      title: `Thoughts - Page ${page}`,
      user: req.user,
      // convert thought to JSON, so Pug can iterate it
      thoughts: thoughts.map((thought) => thought.toJSON()),
      pageNumber: page,
      thoughtsCount,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});

// router.get('/thoughts', async (req, res) => {
//   try {
//     // TODO: implement pagination
//     let thoughts = await Thought.findAll({
//       include: User,
//     });

//     res.cookie('history', '/thoughts');
//     res.render('thoughts', {
//       title: 'Thoughts',
//       user: req.user,
//       // convert thought to JSON, so Pug can iterate it
//       thoughts: thoughts.map((thought) => thought.toJSON()),
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ message: error.message });
//   }
// });

router.get('/share-thought', auth, (req, res) => {
  res.render('shareThought', { title: 'Share Thought', user: req.user });
});

router.post('/shareThought', auth, async (req, res) => {
  // check for required fields
  const { subject, text } = req.body;
  if (!subject || !text) {
    return res.status(401).json({ message: 'Error. Required field is empty' });
  }

  try {
    // create and save new thought
    await Thought.create({
      subject,
      text,
      UserId: req.user.id,
    });
    return res.json({ message: 'SUCCESS' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post('/thumb', auth, async (req, res) => {
  // get params from body
  const { thoughtId } = req.body;
  if (!thoughtId) {
    return res.status(400).json({ message: 'Missing parameters <thoughtId>' });
  }

  try {
    // find thought by id
    const thought = await Thought.findOne({
      where: { id: thoughtId },
    });
    if (!thought) {
      throw new Error("Couldn't find thought!");
    }

    // create a thumbs array if it is not created yet
    // for simplicity we treat thumbs as an array but we actually use strings
    if (!thought.thumbs) {
      thought.thumbs = JSON.stringify(new Array());
    }

    // thubms stored in database as JSON-like array
    // we need to convert it to actual array before manipulating it
    let thumbsArray = JSON.parse(thought.thumbs);

    // if user not thumbed to thought, add his id to thumbs list
    // else if user id in thumbs list, remove it

    if (!thought.thumbs.includes(req.user.id)) {
      thumbsArray.unshift(req.user.id);
    } else {
      thumbsArray = thumbsArray.filter((elem) => elem !== req.user.id);
    }

    // convert thums array to JSON-like array
    thought.thumbs = JSON.stringify(thumbsArray);

    await thought.save();
    return res.json(thought);
  } catch (error) {
    console.error(chalk.red(error.message));
    return res.status(500).json({ message: error.message });
  }
});

router.get('/tokenExpired', (req, res) => {
  res.render('tokenExpired', { title: 'Session expired' });
});

router.get('/*', (req, res) => {
  res.send('NOT IMPLEMENTED YET');
});

module.exports = router;
