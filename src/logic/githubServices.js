const axios = require('axios');
/*
 ** @description Authorize users with github OAuth service
 ** @param code { string } - github generated code
 ** @returns {string} - github authorization key
 */
const githubLogin = async (code) => {
  const githubResponse = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
  return githubResponse['data']['access_token'];
};

const githubGetUser = async (accessToken) => {
  const githubResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  const githubUser = githubResponse.data;
  return githubUser;
};

module.exports = {
  githubLogin,
  githubGetUser,
};
