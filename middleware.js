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

module.exports = { setAuth, auth };
