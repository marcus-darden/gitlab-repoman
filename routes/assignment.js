'use strict';

var models = require('../models');
var helpers = require('../helpers');


var assignmentModule = {
  new: function(req, res, next) {
    // app.get('/:username/:courseLabel/assignment', isStaff, assignment.new);
    res.render('assignment_edit', {
      params: req.params
    });
  },

  create: function(req, res, next) {
    // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
    helpers.assignment.create(req.params.courseLabel, req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  delete: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, assignment.delete);
    helpers.assignment.delete(req.params.courseLabel, req.params.assignmentAbbr).then(function() {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
    });
  },

  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, assignment.homepage);
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
    helpers.assignment.update(req.params.courseLabel,
                              req.params.assignmentAbbr,
                              req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
    helpers.assignment.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
      res.render('assignment_edit', {
        assignment: _assignment,
        params: req.params
      });
    });
  }
};

module.exports = assignmentModule;
