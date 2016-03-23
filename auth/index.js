'use strict';

var fs = require('fs');
var path = require('path');
var passport = require('passport');
var models = require('../models');

passport.serializeUser(function(user, done) {
  var session_user = { id: user.id,
                       oauth_token: user.oauth_token };
  done(null, session_user);
});

passport.deserializeUser(function(session_user, done) {
  models.User.findById(session_user.id).then(function(user) {
    var u = user.get({ plain: true });
    u.oauth_token = session_user.oauth_token;
    done(null, u);
  }).catch(function(err) {
    console.log(err);
    done(new Error('User id ' + id + ' does not exist'));
  });
});


fs
  .readdirSync(path.join(__dirname, 'strategies'))
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file.substr(-3) === '.js';
  })
  .forEach(function (file) {
    var name = file.substring(0, file.length - 3);  // remove extension
    passport.use(name, require(path.join(__dirname, 'strategies', file)));
  });

module.exports = passport;
