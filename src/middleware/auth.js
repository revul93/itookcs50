const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  if ('token' in req.cookies && !req.user) {
    try {
      req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    } catch (error) {
      res.clearCookie('token');
      return res.redirect('/tokenExpired');
    }
  }
  next();
};

const checkAuthentication = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Access denied' });
  }
  // TODO: Call reAuthenticate here
  next();
};

const reAuthenticate = (req, res, next) => {
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

module.exports = {
  authenticate,
  checkAuthentication,
};
