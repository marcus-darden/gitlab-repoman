'use strict';

//var dbconf = require('./database');

module.exports = {
  // Database config (imported from database.js)
  // database: dbconf,


  // Gitlab parameters
  GITLAB_APP_KEY      : process.env.GITLAB_APP_KEY
                          || '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e',
  GITLAB_APP_SECRET   : process.env.GITLAB_APP_SECRET
                          || '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857',
  GITLAB_URL          : process.env.GITLAB_URL
                          || 'https://gitlab.eecs.umich.edu',
  GITLAB_CALLBACK_URL : process.env.GITLAB_CALLBACK_URL
                          || 'http://127.0.0.1:3000/auth/gitlab/callback'
};