'use strict';

var express = require('express');
var passport = require('passport');
var jade = require('jade');
//var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var partials = require('express-partials');

var GitlabStrategy = require('passport-gitlab').Strategy;
var GITLAB_APP_KEY = '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e';
var GITLAB_APP_SECRET = '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857';
var AUTH_USERS = ['mmdarden'];
 
passport.use(new GitlabStrategy({
    clientID: GITLAB_APP_KEY,
    clientSecret: GITLAB_APP_SECRET,
    gitlabURL : 'https://gitlab.eecs.umich.edu',
    callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
  },
  function(token, tokenSecret, profile, done) {
    //console.dir(profile);
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  var u = { name: user.displayName,
            github: user.username,
            pic: user.avatar,
            email: user.username + '@umich.edu',
            uniqname: user.username,
            team_id: '' };
  console.dir(u);
  done(null, u);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


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

app.get('/', function(req, res){
  res.render('index', { classname: 'EECS 494',
                        semester: 'Winter',
                        year: 2016,
                        user: req.user });
});


app.get('/user', ensureAuthenticated, function(req, res) {
  res.render('user', { user: req.user });
});

app.post('/user', ensureAuthenticated, function(req, res) {
        //user_info["uniqname"] = request.json["uniqname"]
        //team_id = user_info["team_id"] = request.json["team_id"]

        //team = teams_db.find_one({"id":team_id})
        var team = { id: 'Team Vim',
                     size: 2 };

        //#check if team exists
        //if (team_id != "") and (not team):
            //return json.dumps({"error":"Invalid Team Id!"})

        //# check if team is full
        //if team and team["size"] >= MAX_TEAM_MEMBERS and user["team_id"] != team_id:
            //return json.dumps({"error": "Team is Full! Maximum Team Size is " + str(MAX_TEAM_MEMBERS)})

        //# save the user
        //users_db.update({ "github":user_info["github"] }, user_info, upsert= True);

        //# increment user count for team 
        //if team and (not user or user["team_id"] != team_id):
            //# user is new to the team
            team['size'] += 1;
            //teams_db.update({ "id": team_id }, team)

        //return json.dumps({"success" : 'ok'})
        res.send({ success: 'ok' });
});

/*
@app.route('/user', methods=["GET","POST"])
@auth_check
def user(github):
    
    user_info = getGHcreds(github)
    user = users_db.find_one({ "github": user_info["github"] })

    if request.method == "GET":
        if user:
            user_info["uniqname"] = user["uniqname"]
            user_info["team_id"] = user["team_id"]

        return render_template('user.jade', **user_info)

    else: #POST
        user_info["uniqname"] = request.json["uniqname"]
        team_id = user_info["team_id"] = request.json["team_id"]

        team = teams_db.find_one({"id":team_id})

        #check if team exists
        if (team_id != "") and (not team):
            return json.dumps({"error":"Invalid Team Id!"})

        # check if team is full
        if team and team["size"] >= MAX_TEAM_MEMBERS and user["team_id"] != team_id:
            return json.dumps({"error": "Team is Full! Maximum Team Size is " + str(MAX_TEAM_MEMBERS)})

        # save the user
        users_db.update({ "github":user_info["github"] }, user_info, upsert= True);

        # increment user count for team 
        if team and (not user or user["team_id"] != team_id):
            # user is new to the team
            team["size"] += 1
            teams_db.update({ "id": team_id }, team)

        return json.dumps({"success" : 'ok'})
 */


app.post('/key', ensureAuthenticated, function(req, res) {
  var user = req.user;
  var team = { id: req.body.key,
               name: '',
               creator: user.uniqname, // user = getGHcreds(github) --- "creator": user["github"],
               size: 0 };
  console.log('/key  team:');
  console.dir(team);
  // teams_db.insert(team);
  res.send('done');
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/gitlab',
  passport.authenticate('gitlab'),
  function(req, res){}  // Redirected to GitLab machine, this is never called
);

app.get('/auth/gitlab/callback', 
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/user');
  }
);

app.listen(3000);

// Use on any resource that needs to be protected
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

function ensureAdmin(req, res, next) {
  if (AUTH_USERS.indexOf(req.user.uniqname) < 0)
    res.status(403).send({status: 403, message: 'Admin access only', type:'internal'});
  else
    return next();
}
