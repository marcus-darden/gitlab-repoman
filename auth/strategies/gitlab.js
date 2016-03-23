'use strict';

var GitlabStrategy = require('passport-gitlab').Strategy;
var config = require('../../config');
var gitlabHelper = require('../../helpers/gitlab');

var gitlabOptions = {
  clientID: config.GITLAB_APP_KEY,
  clientSecret: config.GITLAB_APP_SECRET,
  gitlabURL: config.GITLAB_URL,
  callbackURL: config.GITLAB_CALLBACK_URL,
};

var gitlabVerify = function (token, tokenSecret, profile, done) {
  return gitlabHelper.login(profile).then(function(_user) {
    var u = _user.get({ plain: true });
    u.oauth_token = token;
    return done(null, u);
  }).catch(function(_err) {
    return done(_err, null);
  });
};

module.exports = new GitlabStrategy(gitlabOptions, gitlabVerify);
