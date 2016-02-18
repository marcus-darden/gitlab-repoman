var models = require('../models');

var userModule = {
  homepage: function(req, res, next) {
    // app.get('/:username', isAuthenticated, user.homepage);
    res.render('stub', req.params);
  },

  update: function(req, res, next) {
    // app.post('/:username', isOwner, user.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/edit', isOwner, user.edit);
    res.render('stub', req.params);
  },

  courseNew: function(req, res, next) {
    // app.get('/:username/course', isOwner, user.courseNew);
    res.render('stub', req.params);
  },

  courseCreate: function(req, res, next) {
    // app.post('/:username/course', isOwner, user.courseCreate);
    res.render('stub', req.params);
  },
};

module.exports = userModule;
