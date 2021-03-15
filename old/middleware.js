const jwt = require('jsonwebtoken');

const setAuth = (req, res, next) => {
  if ('token' in req.cookies) {
    try {
      req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    } catch (error) {
      res.clearCookie('token');
      return res.redirect('/tokenExpired');
    }
  }
  next();
};

const auth = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'NOT Authorized' });
  }
  next();
};

const reAuth = (req, res, next) => {
  if ('token' in req.cookies) {
    user = req.user;
    delete user.iat;
    delete user.exp;
    const jwtToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: 3000,
    });
    res.cookie('token', jwtToken);
  }

  next();
};

module.exports = { setAuth, auth, reAuth };
