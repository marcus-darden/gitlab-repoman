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
