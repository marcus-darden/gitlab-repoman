var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  /*models.User.findAll({
    include: [ models.Task ]
  }).then(function(users) { */
    res.render('index', {
        classname: 'EECS XXX',
        semester: 'Winter',
        year: 2016
/*      title: 'Express',
      users: users */
//    });
  });
});

module.exports = router;
