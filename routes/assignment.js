var models = require('../models');

var assignmentModule = {
    homepage: function(req, res, next) {
      // app.get('/:username/:courseLabel/:assignmentLabel', isAuthenticated, assignment.homepage);
      res.render('stub', req.params);
    },

    update: function(req, res, next) {
      // app.post('/:username/:courseLabel/:assignmentLabel', isStaff, assignment.update);
      res.render('stub', req.params);
    },

    edit: function(req, res, next) {
      // app.get('/:username/:courseLabel/:assignmentLabel/edit', isStaff, assignment.edit);
      res.render('stub', req.params);
    },
};

module.exports = assignmentModule;
