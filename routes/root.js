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
  if (AUTH_USERS.indexOf(req.user.uniqname) < 0)
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
               creator: user.username,
               size: 0 };
  console.log('/key  team:');
  console.dir(team);
  models.Team.create(team).then(function(team) {
    res.send('done');
  });
});

module.exports = router;
