const connectEnsureLogin = require('connect-ensure-login');
const courseHelper = require('./course');

const helpers = module.exports = {};

helpers.isAuthenticated = connectEnsureLogin.ensureAuthenticated('/');

helpers.isStaff = function isStaff(req, res, next) {
  if (req.isAuthenticated()) {
    courseHelper.isStaff(req.user.username, req.params.courseLabel).then((_isStaff) => {
      if (_isStaff) {
        next();
      }
      else {
        res.redirect(303, `/${req.params.username}`);
      }
    });
  }
  else {
    res.redirect(303, `/${req.params.username}`);
  }
};

helpers.isOwner = function isOwner(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.username === req.params.username) {
    next();
  }
  res.redirect(303, req.user ? `/${req.params.username}` : '/');
};
