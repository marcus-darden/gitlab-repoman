'use strict';
const models = require('../models');
const helpers = module.exports = {};

//
// BEGIN HELPERS
//

helpers.get = function get(user_username) {
  return models.User.findOne({
    where: { username: user_username },
  });
};

helpers.getRoster = function getRoster(course_id) {
  return models.User.findAll({
    include: [{
      model: models.Course,
      where: { id: course_id },
      through: { where: { gitlab_access_level: 30 } },
    }],
  });
};

helpers.getStaff = function getStaff(course_id) {
  return models.User.findAll({
    include: [{
      model: models.Course,
      where: { id: course_id },
      through: { where: { gitlab_access_level: [20, 40, 50] } },
    }],
  });
};

helpers.getUsers = function getUsers(usernames) {
  let i;
  // const users = [];
  // users.length = usernames.length;

  // Find or Create the users, as necessary
  const users = usernames.map((username) =>
    models.User.findOrCreate({
      where: { username },
    })
  );
  // for (i = 0; i < usernames.length; i++) {
    // users[i] = models.User.findOrCreate({
      // where: { username: usernames[i] },
    // });
  // }

  // "spread" the entire array so only users are returned
  return models.Sequelize.Promise.all(users).then((_users) => {
    for (i = 0; i < users.length; i++) {
      users[i] = _users[i][0];
    }
    return users;
  });
};

helpers.login = function login(profile) {
  return models.User.findOrCreate({
    where: { username: profile.username },
  }).spread((_user, _created) => {
    // Update user properties from GL profile
    if (_created) {
      return _user.update({
        display_name: profile.displayName,
        avatar: profile.avatar,
        gitlab_user_id: profile.id,
      });
    }
    return _user.update({
      display_name: profile.displayName,
      avatar: profile.avatar,
    });
  });
};
