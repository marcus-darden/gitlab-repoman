'use strict';

var Gitlab = require('gitlab');
var userHelper = require('./user');

var helpers = {};

helpers.login = function(profile) {
  // Condition profile to provide the following (default in gitlab)
  // {
  //   username,
  //   id,
  //   displayName,
  //   avatar,
  // }
  return userHelper.login(profile);
};

module.exports = helpers;
