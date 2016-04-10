'use strict';
const express = require('express');
const expressWinston = require('express-winston');
// const util = require('util');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const partials = require('express-partials');
const log = require('./helpers/log');
const passport = require('./auth').passport;

const app = express();
app.locals.pretty = true;

// configure Express
app.use('/static', express.static(`${__dirname}/public`));
app.use('/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'jade');
app.set('view options', { layout: false });
// app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(expressWinston.logger({
  winstonInstance: log,
  level: 'info',
}));

// Routes
app.use(require('./routes/root'));
app.use('/auth', require('./routes/auth').router);
// app.use('/h/:hashid', require('./routes/hashid').router);
app.use('/:username', require('./routes/user').router);
app.use('/:username/course', require('./routes/course').createRouter);
app.use('/:username/:courseLabel', require('./routes/course').router);
app.use('/:username/:courseLabel/assignment', require('./routes/assignment').createRouter);
app.use('/:username/:courseLabel/:assignmentAbbr', require('./routes/assignment').router);

app.use(expressWinston.errorLogger({
  winstonInstance: log,
  level: 'error',
}));

app.listen(3000);
