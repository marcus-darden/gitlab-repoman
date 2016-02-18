'use strict';

var user = require('./user');
var course = require('./course');
var assignment = require('./assignment');
var team = require('./team');

function isAuthenticated(req, res, next) {
  //if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

function isOwner(req, res, next) {
  //if (req.isAuthenticated && req.user.username === req.locals.username)
    return next();
  res.redirect('/');
}

function isStaff(req, res, next) {
  //console.log('isStaff incomplete in ' + module.filename);
  //if (req.isAuthenticated)
    return next();
  res.redirect('/');
}

var routesModule = {
  init: function(app) {
    app.use('/', require('./root'));
    //app.use('/auth', require('./auth'));
    
    app.get('/:username', isAuthenticated, user.homepage);
    app.post('/:username', isOwner, user.update);
    app.get('/:username/edit', isOwner, user.edit);
    app.get('/:username/course', isOwner, user.courseNew);
    app.post('/:username/course', isOwner, user.courseCreate);

    app.get('/:username/:courseLabel', isAuthenticated, course.homepage);
    app.post('/:username/:courseLabel', isStaff, course.update);
    app.get('/:username/:courseLabel/edit', isStaff, course.edit);
    app.get('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    app.post('/:username/:courseLabel/staff', isStaff, course.staffUpdate);
    app.get('/:username/:courseLabel/roster/edit', isStaff, course.rosterEdit);
    app.post('/:username/:courseLabel/roster', isStaff, course.rosterUpdate);
    app.get('/:username/:courseLabel/assignment', isStaff, course.assignmentNew);
    app.post('/:username/:courseLabel/assignment', isStaff, course.assignmentCreate);

    app.get('/:username/:courseLabel/:assignmentLabel', isAuthenticated, assignment.homepage);
    app.post('/:username/:courseLabel/:assignmentLabel', isStaff, assignment.update);
    app.get('/:username/:courseLabel/:assignmentLabel/edit', isStaff, assignment.edit);

    app.get('/:username/:courseLabel/:assignmentLabel/team', isAuthenticated, team.homepage);
    app.post('/:username/:courseLabel/:assignmentLabel/team', isStaff, team.update);
    app.get('/:username/:courseLabel/:assignmentLabel/team/edit', isAuthenticated, team.edit);

    app.get('/h/:hashid', isAuthenticated, function(req, res, next) {
      res.send('Hash ID: ' + req.params.hashid);
    });
  }
};

module.exports = routesModule;
