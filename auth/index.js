const fs = require('fs');
const path = require('path');
const passport = require('passport');
const models = require('../models');
const error = require('../helpers/error');

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    oauth_token: user.oauth_token,
  });
});

passport.deserializeUser((sessionUser, done) => {
  models.User.findById(sessionUser.id).then((_user) => {
    const u = _user.get();
    u.oauth_token = sessionUser.oauth_token;
    done(null, u);
  }).catch(error.handler(done, 'User id does not exist'));
});

fs
  .readdirSync(path.join(__dirname, 'strategies'))
  .filter(file => file.indexOf('.') !== 0 && file.substr(-3) === '.js')
  .forEach((basename) => {
    const filename = basename.substring(0, basename.length - 3);
    passport.use(filename, require(path.join(__dirname, 'strategies', basename)));
  });

module.exports = passport;
