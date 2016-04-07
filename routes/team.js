const express = require('express');
const middleware = require('../helpers/middleware');

const routes = {};
const router = express.Router({ mergeParams: true });
module.exports = {
  router,
  routes,
};

routes.homepage = function homepage(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr/team', isAuthenticated, team.homepage);
  res.render('stub', req.params);
};

routes.update = function update(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr/team', isStaff, team.update);
  res.render('stub', req.params);
};

routes.edit = function edit(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr/team/edit', isAuthenticated, team.edit);
  res.render('stub', req.params);
};

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username/:courseLabel/:assignmentAbbr
// TODO: Fix the middleware here...
router.use(middleware.isAuthenticated);
router.get('/team', routes.homepage);
router.post('/team', middleware.isStaff, routes.update);
router.get('/team/edit', middleware.isStaff, routes.edit);
