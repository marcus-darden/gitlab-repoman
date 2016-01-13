'use strict';

var express = require('express');
var router  = express.Router();

module.exports = function(passport) {
  // simple logger for this router's requests
  // all requests to this router will first hit this middleware
  router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
  });
  
  router.get('/login', function(req, res){
    res.render('login', { user: req.user });
  });
  
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  
  router.get('/:strategy',
    function(req, res, next) {
      passport.authenticate(req.params.strategy)(req, res, next);
    }
  );
  
  router.get('/:strategy/callback', 
    function(req, res, next) {
      passport.authenticate(req.params.strategy, { failureRedirect: '/login' })(req, res, next);
    },
    function(req, res) {
      res.redirect('/user');
    }
  );

  return router;
}
