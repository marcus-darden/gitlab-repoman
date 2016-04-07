const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const helpers = module.exports = {};

fs
  .readdirSync(__dirname)
  .filter((file) =>
    ((file.indexOf('.') !== 0)
     && (file !== basename)
     && (file.slice(-3) === '.js'))
  )
  .forEach((file) => {
    helpers[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });
