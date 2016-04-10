const Gitlab = require('gitlab');
const config = require('../config');
const userHelper = require('./user');

const helpers = module.exports = {};

function getAPI(token) {
  return new Gitlab({
    url: config.GITLAB_URL,
    oauth_token: token,
  });
}

// nabbed from js-promisify
function promisify(fun, args, self) {
  return new Promise((resolve) => {
    args.push(data => resolve(data));
    fun.apply(self, args);
  });
}

helpers.addGroupMembers = function addGroupMembers(token, course, users) {
  const api = getAPI(token);
  const access_level = api.groups.access_levels.MASTER;
  // const promises = [];

  const verified = users.filter((user) => user.gitlab_user_id !== 0);

  // Add verified users (already logged into GL) to the group and return
  // the associated promises, all wrapped into one
//  verified.forEach(function(user) {
//    promises.push(promisify(api.groups.addMember,
//      [course.gitlab_group_id, user.gitlab_user_id, access_level]));
//  });
  const promises = verified.map(user =>
    promisify(
      api.groups.addMember,
      [course.gitlab_group_id, user.gitlab_user_id, access_level]
    )
  );

  return Promise.all(promises);
};

helpers.createGroup = function createGroup(token, course) {
  return promisify(getAPI(token).groups.create, [{
    name: course.label,
    path: course.label,
    description: course.name,
  }]);
};

helpers.login = function login(token, profile) {
  // Condition profile to provide the following (default in gitlab)
  // { username, id, displayName, avatar, }
  return userHelper.login(profile).then(
    _dbUser => helpers.setGitlabUserId(token, _dbUser)
  );
};

helpers.setGitlabUserId = function setGitlabUserId(token, dbUser) {
  // Default: ID already assigned
  if (dbUser.gitlab_user_id) {
    return Promise.resolve(dbUser);
  }

  const api = getAPI(token);
  return promisify(api.users.search, [dbUser.username.trim()]).then((_glUsers) => {
    // Find unique user with the given username and update gitlab profile values
    const glUsers = _glUsers.filter(glUser => glUser.username === dbUser.username.trim());
    if (glUsers.length === 0) {
      return Promise.resolve(dbUser);
    }
    return dbUser.update({
      avatar: glUsers[0].avatar_url,
      display_name: glUsers[0].name,
      gitlab_user_id: glUsers[0].id,
    });
  });
};

