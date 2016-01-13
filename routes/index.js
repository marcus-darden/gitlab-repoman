'use strict';

var fs = require('fs');
var path = require('path');
var routes = {};

module.exports = function(passport) {
  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return file.indexOf('.') !== 0 && file !== 'index.js' && file.substr(-3) === '.js';
    })
    .forEach(function (file) {
      var name = file.substring(0, file.length - 3);  // remove extension
      routes[name] = require(path.join(__dirname, file))(passport);
    });

  return routes;
}

/*
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    res.render('index', {
        classname: 'EECS XXX',
        semester: 'Winter',
        year: 2016
//    });
  });
});

module.exports = router;
 */
