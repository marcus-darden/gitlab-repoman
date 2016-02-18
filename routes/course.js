var models = require('../models');

var courseModule = {
  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel', isAuthenticated, course.homepage);
    res.render('stub', req.params);
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel', isStaff, course.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/edit', isStaff, course.edit);
    res.render('stub', req.params);
  },

  staffEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    res.render('stub', req.params);
  },

  staffUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/staff', isStaff, course.staffUpdate);
    res.render('stub', req.params);
  },

  rosterEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/roster/edit', isStaff, course.rosterEdit);
    res.render('stub', req.params);
  },

  rosterUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/roster', isStaff, course.rosterUpdate);
    res.render('stub', req.params);
  },

  assignmentNew: function(req, res, next) {
    // app.get('/:username/:courseLabel/assignment', isStaff, course.assignmentNew);
    res.render('stub', req.params);
  },

  assignmentCreate: function(req, res, next) {
    // app.post('/:username/:courseLabel/assignment', isStaff, course.assignmentCreate);
    res.render('stub', req.params);
  },
};

module.exports = courseModule;
