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
  //console.log('profile');
  //console.dir(profile);
  models.User.findOrCreate({
    where: { username: profile.username },
    defaults: {
      display_name: profile.displayName, 
      avatar: profile.avatar
    }
  }).spread(function (user, created) {
    //console.log('In strategy: ');
    var u = user.get({ plain: true });
    u.private_token = profile.privateToken;
    //console.dir(u);
    done(null, u);
  }).catch(function (e) {
    done(e, null);
  });
});

module.exports = strategy;
