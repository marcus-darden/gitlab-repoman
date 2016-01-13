'use strict';

var AUTH_USERS = ['mmdarden'];

var express = require('express');
var router = express.Router();
  

// Use on any resource that needs to be protected
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// Use on any resource that is admin only
function ensureAdmin(req, res, next) {
  if (AUTH_USERS.indexOf(req.user.uniqname) < 0)
    res.status(403).send({status: 403, message: 'Admin access only', type:'internal'});
  else
    return next();
}


module.exports = function(passport) {

  router.get('/', function(req, res){
    res.render('index', { classname: 'EECS 494',
                          semester: 'Winter',
                          year: 2016,
                          user: req.user });
  });

  router.get('/user', ensureAuthenticated, function(req, res) {
    res.render('user', { user: req.user });
  });

  router.post('/user', ensureAuthenticated, function(req, res) {
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

  router.post('/key', ensureAuthenticated, function(req, res) {
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

  return router;
}
