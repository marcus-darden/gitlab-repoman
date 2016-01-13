'use strict';

var GITLAB_APP_KEY      = process.env.GITLAB_APP_KEY
                          || '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e';
var GITLAB_APP_SECRET   = process.env.GITLAB_APP_SECRET
                          || '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857';
var GITLAB_URL          = process.env.GITLAB_URL
                          || 'https://gitlab.eecs.umich.edu';
var GITLAB_CALLBACK_URL = process.env.GITLAB_CALLBACK_URL
                          || 'http://127.0.0.1:3000/auth/gitlab/callback';
 
var GitlabStrategy = require('passport-gitlab').Strategy;
var strategy = new GitlabStrategy({
    clientID    : GITLAB_APP_KEY,
    clientSecret: GITLAB_APP_SECRET,
    gitlabURL   : GITLAB_URL,
    callbackURL : GITLAB_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
);

module.exports = strategy;
