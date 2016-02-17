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
    where: { username: profile.username }
  }).spread(function (user, created) {
    // Update user properties from GL
    models.User.update({
      display_name: profile.displayName,
      avatar: profile.avatar,
    }, {
      where: {
        id: user.id
      },
      returning: true
    }).spread(function(num_affected, updated_users) {
      if (num_affected == 1)
        var u = updated_users[0].get({ plain: true });
      else
        var u = user.get({ plain: true });
      u.display_name = profile.displayName;
      u.avatar = profile.avatar;
      u.oauth_token = token;
      done(null, u);
    });
  }).catch(function (e) {
    done(e, null);
  });
});

module.exports = strategy;
