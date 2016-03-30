'use strict';

var express = require('express');
var auth = require('./auth');
var passport = require('passport');
var jade = require('jade');
//var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var partials = require('express-partials');

var app = express();
app.locals.pretty = true;

// configure Express
app.use('/static', express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
//app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(require('./routes/root'));
app.use('/auth', require('./routes/auth').router);
//app.use('/h/:hashid', require('./routes/hashid').router);
app.use('/:username', require('./routes/user').router);
app.use('/:username/course', require('./routes/course').createRouter);
app.use('/:username/:courseLabel', require('./routes/course').router);
app.use('/:username/:courseLabel/assignment', require('./routes/assignment').createRouter);
app.use('/:username/:courseLabel/:assignmentAbbr', require('./routes/assignment').router);

app.listen(3000);
