'use strict';

var fs = require('fs');
var path = require('path');
var passport = require('passport');
var models = require('../models');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
//  var u = { username: user.username,
//            display_name: user.displayName,
//            avatar: user.avatar,
//            team_id: '' };
//  console.dir(u);
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  models.User.findByPrimary(username).then(function(user) {
    done(null, user);
  }).catch(function(err) {
    console.log(err);
    done(new Error('User name \'' + username + '\' does not exist'));
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
