'use strict';

const Gitlab = require('gitlab');
const config = require('../config');
const userHelper = require('./user');

function getAPI(token) {
  return new Gitlab({
    url: config.GITLAB_URL,
    oauth_token: token,
  });
}

// nabbed from js-promisify
// edited 1 line
// commented out 1 line
function promisify(fun, args, self) {
  return new Promise(function (resolve, reject) {
    //args.push(function(err, data) {
    args.push(function(data) {
      //err && reject(err);
      resolve(data);
    });
    fun.apply(self, args);
  });
}

function addGroupMembers(token, course, users) {
  const api = getAPI(token);
  const access_level = api.groups.access_levels['MASTER'];
  const promises = [];

  const verified = users.filter((user) => user.gitlab_user_id !== 0);

  // Add verified users (already logged into GL) to the group and return
  // the associated promises, all wrapped into one
  verified.forEach(function(user) {
    promises.push(promisify(api.groups.addMember,
      [course.gitlab_group_id, user.gitlab_user_id, access_level]));
  });

  return Promise.all(promises);
}

function createGroup(token, course) {
  return promisify(getAPI(token).groups.create, [{
    name: course.label,
    path: course.label,
    description: course.name,
  }]);
}

function login(token, profile) {
  // Condition profile to provide the following (default in gitlab)
  // {
  //   username,
  //   id,
  //   displayName,
  //   avatar,
  // }
  return userHelper.login(profile).then(function(_dbUser) {
    return setGitlabUserId(token, _dbUser);
  });
}

function setGitlabUserId(token, dbUser) {
  let glUsers;
  let api = getAPI(token);
  if (dbUser.gitlab_user_id)
    return Promise.resolve(dbUser);
  return promisify(api.users.search, [dbUser.username.trim()]).then(function(_glUsers) {
    glUsers = _glUsers.filter((glUser) => glUser.username === dbUser.username.trim());
    if (glUsers.length == 0)
      return Promise.resolve(dbUser);
    return dbUser.update({
      avatar: glUsers[0].avatar_url,
      display_name: glUsers[0].name,
      gitlab_user_id: glUsers[0].id,
    });
  });
}

module.exports = {
  addGroupMembers,
  createGroup,
  login,
  setGitlabUserId,
};
