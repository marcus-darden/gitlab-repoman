'use strict';

var models = require('../models');

var helpers = {};

helpers.get = function(user_username) {
  return models.User.findOne({
    where: { username: user_username },
  });
};

helpers.getRoster = function(course_id) {
  return models.User.findAll({
    include: [{
      model: models.Course,
      where: { id: course_id },
      through: { where: { gitlab_access_level: 30 } },
    }]
  });
};

helpers.getStaff = function(course_id) {
  return models.User.findAll({
    include: [{
      model: models.Course,
      where: { id: course_id },
      through: { where: { gitlab_access_level: [20, 40, 50] } },
    }]
  });
};

helpers.getUsers = function(usernames) {
  var i, users = [];
  users.length = usernames.length;

  // Find or Create the users, as necessary
  for (i = 0; i < usernames.length; i++) {
    users[i] = models.User.findOrCreate({
      where: { username: usernames[i] },
    });
  }

  // "spread" the entire array so only users are returned
  return models.Sequelize.Promise.all(users).then(function(_users) {
    for (i = 0; i < users.length; i++) {
      users[i] = _users[i][0];
    }
    return users;
  });
};

helpers.login = function(profile) {
  return models.User.findOrCreate({
    where: { username: profile.username },
  }).spread(function (_user, _created) {
    // Update user properties from GL
    return _user.update({
      display_name: profile.displayName,
      avatar: profile.avatar,
      gitlab_user_id: profile.id,  // Maybe first time only
    });
  });
};

module.exports = helpers;
