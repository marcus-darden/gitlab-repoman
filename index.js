var express = require('express');
var path = require('path');

var app = express();

var auth = require('./routes/auth');
app.use('/auth', auth);

var index = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* 
app.get('/', function (req, res) {
  res.send('Hello World!');
});
 */
app.get('/login', function(req, res) {
});

app.use('/', index);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    });
});

module.exports = app;

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
