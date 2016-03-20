'use strict';

var models = require('../models');
var assignmentHelper = require('../helpers/assignment');


var assignmentModule = {
  new: function(req, res, next) {
    // app.get('/:username/:courseLabel/assignment', isStaff, assignment.new);
    res.render('assignment_edit', {
      user: req.user,
      course_label: req.params.courseLabel
    });
  },

  create: function(req, res, next) {
    // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
    assignmentHelper.create(req.params.courseLabel, req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  delete: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, assignment.delete);
    assignmentHelper.delete(req.params.courseLabel, req.params.assignmentAbbr).then(function() {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
    });
  },

  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, assignment.homepage);
    var assignment;
    assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
      assignment = _assignment;
    
      return assignment.getTeams();
    }).then(function(_teams) {
      res.render('assignment', {
        user: req.user,
        course_label: req.params.courseLabel,
        assignment: assignment,
        teams: _teams
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
    assignmentHelper.update(req.params.courseLabel,
                              req.params.assignmentAbbr,
                              req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
    assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
      res.render('assignment_edit', {
        user: req.user,
        course_label: req.params.courseLabel,
        assignment: _assignment
      });
    });
  }
};

module.exports = assignmentModule;
