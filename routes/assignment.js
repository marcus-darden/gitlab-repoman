var models = require('../models');
var helpers = require('../helpers');

var assignmentModule = {
  new: function(req, res, next) {
    // app.get('/:username/:courseLabel/assignment', isStaff, assignment.new);
    res.render('assignment_new', {
      params: req.params
    });
  },

  create: function(req, res, next) {
    // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
    var abbr, minTeamSize, maxTeamSize, createTeams;
    //res.render('stub', req.params);
    console.log('ASSIGNMENT CREATE');

    // Clean assignment abbreviation
    if (req.body.abbr.length)
      abbr = req.body.abbr.toLowerCase().replace(' ', '-');
    else
      abbr = req.body.name.toLowerCase().replace(' ', '-');

    // Clean team size variables
    minTeamSize = Number(req.body.minTeamSize) || 1;
    maxTeamSize = Number(req.body.maxTeamSize) || minTeamSize;

    // Clean team creation method
    createTeams = req.body.createTeams.toLowerCase().charAt(0);
    if (createTeams === 'r')
      createTeams = 'random';
    else if (createTeams === 'optin')
      createTeams = 'optin';
    else
      createTeams = 'manual';

    helpers.assignment.create(req.params.courseLabel, req.body.name, abbr, minTeamSize, maxTeamSize, createTeams).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, assignment.homepage);
    //res.render('stub', req.params);
    var assignment;
    helpers.assignment.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
      assignment = _assignment;
    
      return assignment.getTeams();
    }).then(function(_teams) {
      res.render('assignment', {
        assignment: assignment,
        teams: _teams,
        params: req.params
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
    res.render('stub', req.params);
  }
};

module.exports = assignmentModule;
