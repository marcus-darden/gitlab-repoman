'use strict';

var AUTH_USERS = ['mmdarden'];

var express = require('express');
var models = require('../models');
var config = require('../config');
var router = express.Router();
  

// Use on any resource that needs to be protected
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// Use on any resource that is admin only
function ensureAdmin(req, res, next) {
  if (AUTH_USERS.indexOf(req.user.id) < 0)
    res.status(403).send({status: 403, message: 'Admin access only', type:'internal'});
  else
    return next();
}


router.get('/', function(req, res){
  console.log('Root: ');
  console.dir(req.user);
  res.render('index', { classname: config.REPOMAN_CLASSNAME,
                        semester: config.REPOMAN_SEMESTER,
                        year: config.REPOMAN_YEAR,
                        user: req.user });
});

router.get('/user', ensureAuthenticated, function(req, res) {
  res.render('user', { user: req.user });
});

router.post('/user', ensureAuthenticated, function(req, res) {
  var user = req.user;
  var team_id = req.body.team_id;

  models.Team.findById(team_id).then(function(team) {
    if (!team)
      res.send({error: 'Invalid Team ID!'});
    else {
      if (team.size >= 3 && user.team_id != team_id)
        res.send({ error: 'Team is Full! Maximum Team Size is 3' });
      user.update({ team_id: team_id }).then(function(user) {
        team.update({ size: team.size + 1 }).then(function(team) {
          res.send({ success: 'ok' });
        });
      });
    }
  });
});

router.post('/key', ensureAuthenticated, function(req, res) {
  var user = req.user;
  var team = { id: req.body.key,
               name: '',
               creator: user.id,
               size: 0 };
  console.log('/key  team:');
  console.dir(team);
  models.Team.create(team).then(function(team) {
    res.send('done');
  });
});

router.get('/team/:id', ensureAuthenticated, function(req, res) {
  var user = req.user;
  models.Team.findById(req.params.id).then(function(team) {
    if (!team)
      team = {};
    team.members = [];
    models.User.findAll({ where: { team_id: req.params.id }}).then(function(users) {
      var ii;
      for (ii = 0; ii < users.length; ++ii)
        if (users[ii].username === user.id)
          team.members = users;
      res.render('team', { team: team });
    }); 
  });
});

router.post('/team/:id', ensureAuthenticated, function(req, res) {
  models.Team.findById(req.params.id).then(function(team) {
    team.update({ name: req.body.name }).then(function(team) {
      res.send({ success: 'ok' });
    });
  });
});

router.get('/team/:id/quit', ensureAuthenticated, function(req, res) {
  var user = req.user;
  var user_team_id = user.team_id;
  user.update({ team_id: null }).then(function(user) {
    models.Team.findById(req.params.id).then(function(team) {
      if (team && user_team_id === req.params.id) {
        team.size -= 1;
        if (team.size <= 0)
          models.Team.destroy({ where: { id: team.id }});
        else
          team.update();
      }
      res.redirect('/user');
    });
  });
});

module.exports = router;
