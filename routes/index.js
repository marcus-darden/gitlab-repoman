'use strict';

var helpers = require('../helpers');

// route handlers
var user = require('./user');
var course = require('./course');
var assignment = require('./assignment');
var team = require('./team');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect(303, '/');
}

function isOwner(req, res, next) {
  if (req.isAuthenticated && req.user && req.user.username === req.params.username)
    return next();
  res.redirect(303, '/' + (req.user? req.user.username : ''));
}

function isStaff(req, res, next) {
  if (req.isAuthenticated()) {
    helpers.course.isStaff(req.params.username, req.params.courseLabel).then(function(_isStaff) {
      if (_isStaff)
        return next();
      else
        res.redirect(303, '/' + req.params.username);
    });
  }
  else
    res.redirect(303, '/' + req.params.username);
}

var routesModule = {
  init: function(app) {
    app.use('/', require('./root'));
    app.use('/auth', require('./auth'));
    
    app.get('/h/:hashid', isAuthenticated, function(req, res, next) {
      res.send('Hash ID: ' + req.params.hashid);
    });

    app.get ('/:username', isOwner, user.homepage);
    app.post('/:username', isOwner, user.update);
    app.get ('/:username/edit', isOwner, user.edit);

    app.get ('/:username/course', isOwner, course.new);
    app.post('/:username/course', isOwner, course.create);
    app.get ('/:username/:courseLabel', isAuthenticated, course.homepage);
    app.post('/:username/:courseLabel', isStaff, course.update);
    app.get ('/:username/:courseLabel/edit', isStaff, course.edit);
    app.post('/:username/:courseLabel/staff', isStaff, course.staffUpdate);
    app.get ('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    app.post('/:username/:courseLabel/roster', isStaff, course.rosterUpdate);
    app.get ('/:username/:courseLabel/roster/edit', isStaff, course.rosterEdit);

    app.get ('/:username/:courseLabel/assignment', isStaff, assignment.new);
    app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
    app.get ('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, assignment.homepage);
    app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
    app.get ('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);

    app.get('/:username/:courseLabel/:assignmentAbbr/team', isAuthenticated, team.homepage);
    app.post('/:username/:courseLabel/:assignmentAbbr/team', isStaff, team.update);
    app.get('/:username/:courseLabel/:assignmentAbbr/team/edit', isAuthenticated, team.edit);
  }
};

module.exports = routesModule;
