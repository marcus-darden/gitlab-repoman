'use strict';

var fs = require('fs');
var path = require('path');
var passport = require('passport');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  var u = { name: user.displayName,
            github: user.username,
            pic: user.avatar,
            email: user.username + '@umich.edu',
            uniqname: user.username,
            team_id: '' };
  console.dir(u);
  done(null, u);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.substr(-3) === '.js';
  })
  .forEach(function (file) {
    var name = file.substring(0, file.length - 3);  // remove extension
    passport.use(name, require(path.join(__dirname, file)));
  });

module.exports = passport;
