const express = require('express');
const config = require('../config');
const router = express.Router();

// FIXME: We need a better homepage: router, helper, and jade
router.get('/', (req, res) => {
  console.log('Root: ');
  console.dir(req.user);
  res.render('index', {
    classname: config.REPOMAN_CLASSNAME,
    semester: config.REPOMAN_SEMESTER,
    year: config.REPOMAN_YEAR,
    user: req.user,
  });
});

module.exports = router;
