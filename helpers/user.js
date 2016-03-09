var models = require('../models');

module.exports = {
  getRoster: function(course_id) {
    return models.User.findAll({
      include: [{
        model: models.Course,
        where: { id: course_id },
        through: { where: { gitlab_role: { $lt: 40 } } }
      }]
    });
  },

  getStaff: function(course_id) {
    return models.User.findAll({
      include: [{
        model: models.Course,
        where: { id: course_id },
        through: { where: { gitlab_role: { $gte: 40 } } }
      }]
    });
  },

  getUsers: function(usernames) {
    var i, users = [];
    users.length = usernames.length;

    // Find or Create the users, as necessary
    for (i = 0; i < usernames.length; i++) {
      users[i] = models.User.findOrCreate({
        where: { username: usernames[i] }
      });
    }

    // "spread" the entire array so only users are returned
    return models.Sequelize.Promise.all(users).then(function(_users) {
      for (i = 0; i < users.length; i++) {
        users[i] = _users[i][0];
      }
      return users;
    });
  }
};
