const helmet = require('helmet');

module.exports = () =>
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
  });
