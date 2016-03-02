var models = require('../models');
var helpers = require('../helpers');

var userModule = {
  homepage: function(req, res, next) {
    // app.get('/:username', isAuthenticated, user.homepage);
    helpers.course.getUserCourses(req.user.id).then(function(_values) {
      res.render('user', {
        user: req.user,
        taught: _values[0],
        taken: _values[1],
        params: req.params
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username', isOwner, user.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/edit', isOwner, user.edit);
    res.render('stub', req.params);
  }
};

module.exports = userModule;
