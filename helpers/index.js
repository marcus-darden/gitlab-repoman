'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var helpers   = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0)
           && (file !== basename)
           && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    helpers[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });

module.exports = helpers;
