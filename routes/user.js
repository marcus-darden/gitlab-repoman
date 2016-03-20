'use strict';

var models = require('../models');
var courseHelper = require('../helpers/course');

var userModule = {
  homepage: function(req, res, next) {
    // app.get('/:username', isAuthenticated, user.homepage);
    var taught, taken;
    return courseHelper.getCoursesTaught(req.user.id).then(function(_taught) {
      taught = _taught;
      return courseHelper.getCoursesTaken(req.user.id);
    }).then(function(_taken) {
      taken = _taken;
      res.render('user', {
        user: req.user,
        taught: taught,
        taken: taken
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
