'use strict';

var config = require('../config');
var express = require('express');
var router = express.Router();
var gitlab = require('gitlab');
var models = require('../models');


router.get('/', function(req, res) {
  var Gitlab = gitlab({
    url: config.GITLAB_URL,
    token: req.user.private_token
  });
  Gitlab.groups.all(function(groups) {
    res.render('admin', { user: req.user, groups: groups });
  });
});

router.get('/create/:id', function(req, res) {
  var Gitlab = gitlab({
    url: config.GITLAB_URL,
    token: req.user.private_token
  });
  Gitlab.groups.show(req.params.id, function(group) {
    models.Team.findAll({ where: ['size > ?', 0] }).then(function(teams) {
      var num_teams = 0,
          num_repos = 0,
          num_users = 0;
      for (var i = 0; i < teams.length; ++i) {
        var team_name = 'team_' + teams[i].id;
        if (!teams[i].gh_team) {
          var g_team = group.create_team(team_name, permission='push');
          ++num_teams;
          teams[i].gh_team = g_team.id;
          teams[i].update({ gh_team: g_team.id });
          console.log('Created team: ' + team_name + ' - ' + g_team.id);
        }
        else {
          g_team = group.get_team(team.gh_team);
          console.log('Team exists: ' + team_name + ' - ' + g_team.id);
        }

        //var repo_name = project_name + '_' + teams[i].id;
        var repo_name = 'test' + '_' + teams[i].id;
        //if (!teams[i]['gh_' + project_name]) {
        if (!teams[i].gh_test) {
          //var gh_repo = group.create_repo(repo_name, team_id=g_team, private=true);
          ++num_repos;
          //teams[i]['gh_' + project_name] = gh_repo.name;
          //teams[i].gh_test = gh_repo.name;
        }
      }
    });
  });
});

module.exports = router;
