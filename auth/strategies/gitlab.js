'use strict';

var config = require('../../config');
var models = require('../../models');
var GitlabStrategy = require('passport-gitlab').Strategy;

var strategy = new GitlabStrategy({
  clientID: config.GITLAB_APP_KEY,
  clientSecret: config.GITLAB_APP_SECRET,
  gitlabURL: config.GITLAB_URL,
  callbackURL: config.GITLAB_CALLBACK_URL
}, function (token, tokenSecret, profile, done) {
  models.User.findOrCreate({
    where: { username: profile.username },
    defaults: {
      display_name: profile.displayName, 
      avatar: profile.avatar
    }
  }).spread(function (user, created) {
    done(null, user.get({ plain: true }));
  }).catch(function (e) {
    done(e, null);
  });
});

module.exports = strategy;
