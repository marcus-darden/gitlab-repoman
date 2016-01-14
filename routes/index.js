'use strict';

var fs = require('fs');
var path = require('path');
var routes = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.substr(-3) === '.js';
  })
  .forEach(function (file) {
    var name = file.substring(0, file.length - 3);  // remove extension
    routes[name] = require(path.join(__dirname, file));
  });

module.exports = routes;
