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
app.use('/static', express.static(__dirname + '/public'));

// Routes
var routes = require('./routes');
app.use('/', routes.root);
app.use('/auth', routes.auth);

app.listen(3000);
