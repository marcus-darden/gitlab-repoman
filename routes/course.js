const express = require('express');
const error = require('../helpers/error');
const middleware = require('../helpers/middleware');
const userHelper = require('../helpers/user');
const courseHelper = require('../helpers/course');
const gitlabHelper = require('../helpers/gitlab');

const createRouter = express.Router({ mergeParams: true });
const router = express.Router({ mergeParams: true });
const routes = {};
module.exports = {
  createRouter,
  router,
  routes,
};

routes.create = function create(req, res, next) {
  // app.post('/:username/course', isOwner, create);
  let course;

  courseHelper.create(req.user.id, req.body).then((_course) => {
    course = _course;
    return gitlabHelper.createGroup(req.user.oauth_token, course);
  }).then(
    _group => course.update({ gitlab_group_id: _group.id })
  ).then(() => {
    res.redirect(303, `/${req.user.username}/${course.label}`);
  }).catch(error.handler(next, 'Could not create course.'));
};

routes.deleteCourse = function deleteCourse(req, res, next) {
  // app.post('/:username/:courseLabel/delete', isOwner, deleteCourse);
  courseHelper.deleteCourse(req.params.courseLabel).then(() => {
    res.redirect(303, `/${req.params.username}`);
  }).catch(error.handler(next, 'Could not delete course.'));
};

routes.edit = function edit(req, res, next) {
  // app.get('/:username/:courseLabel/edit', isStaff, edit);
  const tokens = req.params.courseLabel.split('-');
  const label = {
    department: tokens[0].toUpperCase(),
    number: tokens[1],
    section: '',
    semester: '',
    year: '',
  };
  if (tokens.length === 4) {
    label.semester = tokens[2];
    label.year = tokens[3];
  }
  else if (tokens.length === 5) {
    label.section = tokens[2];
    label.semester = tokens[3];
    label.year = tokens[4];
  }
  if (label.semester) {
    label.semester = label.semester.charAt(0).toUpperCase()
                     + label.semester.slice(1);
  }

  courseHelper.get(req.params.courseLabel).then((_course) => {
    res.render('course_edit', {
      label,
      user: req.user,
      courseName: _course.name,
    });
  }).catch(error.handler(next, 'Could not edit course.'));
};

routes.homepage = function homepage(req, res, next) {
  // app.get('/:username/:courseLabel', isAuthenticated, homepage);
  let course;

  courseHelper.get(req.params.courseLabel).then((_course) => {
    course = _course;
    const staff = userHelper.getStaff(course.id);
    const roster = userHelper.getRoster(course.id);
    const assignments = course.getAssignments();

    return Promise.all([
      staff,
      roster,
      assignments,
    ]);
  }).spread((_staff, _roster, _assignments) => {
    res.render('course', {
      course,
      user: req.user,
      staff: _staff,
      roster: _roster,
      assignments: _assignments,
    });
  }).catch(error.handler(next, 'Could not show course.'));
};

// TODO: no next
routes.newCourse = function newCourse(req, res) {
  // app.get('/:username/course', isOwner, newCourse);
  res.render('course_edit', {
    user: req.user,
  });
};

routes.rosterEdit = function rosterEdit(req, res, next) {
  // app.get('/:username/:courseLabel/roster/edit', isStaff, rosterEdit);
  res.render('stub', req.params);
};

routes.rosterUpdate = function rosterUpdate(req, res, next) {
  // app.post('/:username/:courseLabel/roster', isStaff, rosterUpdate);
  let uniqnames = req.body.students.trim().toLowerCase();

  if (!uniqnames.length) {
    return;
  }
  uniqnames = uniqnames.split(/[.,;\s]+/);

  userHelper.getUsers(uniqnames).then((_dbUsers) => {
    const promises = _dbUsers.map(
      dbUser => gitlabHelper.setGitlabUserId(req.user.oauth_token, dbUser)
    );
    return Promise.all(promises);
  }).then(
    _users => courseHelper.addUsers(req.params.courseLabel, _users, 30)
  ).then(() => {
    res.redirect(303, `/${req.params.username}/${req.params.courseLabel}`);
  }).catch(error.handler(next, 'Could not update roster.'));
};

routes.staffEdit = function staffEdit(req, res, next) {
  // app.get('/:username/:courseLabel/staff/edit', isStaff, staffEdit);
  res.render('stub', req.params);
};

routes.staffUpdate = function staffUpdate(req, res, next) {
  // app.post('/:username/:courseLabel/staff', isStaff, staffUpdate);
  let users;
  let uniqnames = req.body.members.trim().toLowerCase();

  // Condition the usernames input
  if (!uniqnames.length) {
    return;
  }
  uniqnames = uniqnames.split(/[.,;\s]+/);

  // This is how we update the staff
  // 1. Find the users in the DB
  // 2. Associate all users with course in the DB
  // 3. Associate existing GL users with group on GL
  userHelper.getUsers(uniqnames).then((_dbUsers) => {
    const promises = _dbUsers.map(
      dbUser => gitlabHelper.setGitlabUserId(req.user.oauth_token, dbUser)
    );
    return Promise.all(promises);
  }).then((_users) => {
    users = _users;
    return courseHelper.addUsers(req.params.courseLabel, _users, 40);
  }).then(
    _course => gitlabHelper.addGroupMembers(req.user.oauth_token, _course, users)
  ).then(() => {
    res.redirect(303, `/${req.params.username}/${req.params.courseLabel}`);
  }).catch(error.handler(next, 'Could not update staff.'));
};

routes.update = function update(req, res, next) {
  // app.post('/:username/:courseLabel', isStaff, update);
  courseHelper.update(req.params.courseLabel, req.body).then((_course) => {
    res.redirect(303, `/${req.params.username}/${_course.label}`);
  }).catch(error.handler(next, 'Could not update course.'));
};

// Connect the routes to handlers
// Protect these routes behind ownership
// mount at /:username/course
createRouter.use(middleware.isOwner);
createRouter.get('/', routes.newCourse);
createRouter.post('/', routes.create);

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username/:courseLabel
router.use(middleware.isAuthenticated);
router.get('/', routes.homepage);
router.post('/', middleware.isStaff, routes.update);
router.post('/delete', middleware.isOwner, routes.deleteCourse);
router.get('/edit', middleware.isStaff, routes.edit);
router.post('/roster', middleware.isStaff, routes.rosterUpdate);
router.post('/staff', middleware.isStaff, routes.staffUpdate);
router.get('/roster/edit', middleware.isStaff, routes.rosterEdit);
router.get('/staff/edit', middleware.isStaff, routes.staffEdit);
