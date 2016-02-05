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
    where: { id: profile.username }
  }).spread(function (user, created) {
    var u = user.get({ plain: true });
    u.display_name = profile.displayName;
    u.avatar = profile.avatar;
    u.oauth_token = token;
    done(null, u);
  }).catch(function (e) {
    done(e, null);
  });
});

module.exports = strategy;
