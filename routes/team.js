var models = require('../models');

var teamModule = {
    homepage: function(req, res, next) {
      // app.get('/:username/:courseLabel/:assignmentLabel/team', isAuthenticated, team.homepage);
      res.render('stub', req.params);
    },

    update: function(req, res, next) {
      // app.post('/:username/:courseLabel/:assignmentLabel/team', isStaff, team.update);
      res.render('stub', req.params);
    },

    edit: function(req, res, next) {
      // app.get('/:username/:courseLabel/:assignmentLabel/team/edit', isAuthenticated, team.edit);
      res.render('stub', req.params);
    },
};

module.exports = teamModule;
