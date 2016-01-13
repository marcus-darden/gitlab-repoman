'use strict';

var config = require('../../config');
var GitlabStrategy = require('passport-gitlab').Strategy;

var strategy = new GitlabStrategy({
    clientID    : config.GITLAB_APP_KEY,
    clientSecret: config.GITLAB_APP_SECRET,
    gitlabURL   : config.GITLAB_URL,
    callbackURL : config.GITLAB_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
);

module.exports = strategy;
