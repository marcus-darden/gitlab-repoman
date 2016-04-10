'use strict';
const express = require('express');
const error = require('../helpers/error');
const middleware = require('../helpers/middleware');
const assignmentHelper = require('../helpers/assignment');

const createRouter = express.Router({ mergeParams: true });
const router = express.Router({ mergeParams: true });
const routes = {};
module.exports = {
  createRouter,
  router,
  routes,
};

routes.create = function create(req, res, next) {
  // app.post('/:username/:courseLabel/assignment', isStaff, create);
  assignmentHelper.create(req.params.courseLabel, req.body).then((_assignment) => {
    res.redirect(303, `/${req.params.username}/${req.params.courseLabel}/${_assignment.abbr}`);
  }).catch(error.handler(next, 'Could not create assignment.'));
};

routes.deleteAssignment = function deleteAssignment(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, deleteAssignment);
  assignmentHelper.deleteAssignment(
    req.params.courseLabel,
    req.params.assignmentAbbr
  ).then(() => {
    res.redirect(303, `/${req.params.username}/${req.params.courseLabel}`);
  }).catch(error.handler(next, 'Could not delete assignment.'));
};

routes.edit = function edit(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, edit);
  assignmentHelper.get(
    req.params.courseLabel,
    req.params.assignmentAbbr
  ).then((_assignment) => {
    res.render('assignment_edit', {
      user: req.user,
      course_label: req.params.courseLabel,
      assignment: _assignment,
    });
  }).catch(error.handler(next, 'Could not edit assignment.'));
};

routes.homepage = function homepage(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, homepage);
  let assignment;
  assignmentHelper.get(
    req.params.courseLabel,
    req.params.assignmentAbbr
  ).then((_assignment) => {
    assignment = _assignment;
    return assignment.getTeams();
  }).then((_teams) => {
    res.render('assignment', {
      assignment,
      user: req.user,
      course_label: req.params.courseLabel,
      teams: _teams,
    });
  }).catch(error.handler(next, 'Could not show assignment.'));
};

// TODO: no next
routes.newAssignment = function newAssignment(req, res) {
  // app.get('/:username/:courseLabel/assignment', isStaff, newAssignment);
  res.render('assignment_edit', {
    user: req.user,
    course_label: req.params.courseLabel,
  });
};

routes.update = function update(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, update);
  assignmentHelper.update(
    req.params.courseLabel,
    req.params.assignmentAbbr,
    req.body
  ).then((_assignment) => {
    res.redirect(303, `/${req.params.username}/${req.params.courseLabel}/${_assignment.abbr}`);
  }).catch(error.handler(next, 'Could not update assignment.'));
};

// Connect the routes to handlers
// Protect these routes behind staff membership
// mount at /:username/:courseLabel/assignment
createRouter.use(middleware.isStaff);
createRouter.get('/', routes.newAssignment);
createRouter.post('/', routes.create);

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username/:courseLabel/:assignmentAbbr
router.use(middleware.isAuthenticated);
router.get('/', routes.homepage);
router.post('/', middleware.isStaff, routes.update);
router.post('/delete', middleware.isStaff, routes.deleteAssignment);
router.get('/edit', middleware.isStaff, routes.edit);
