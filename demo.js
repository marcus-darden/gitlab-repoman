var express = require('express');
var app = express();
var passport = require('passport');
//var TokenStrategy = require('passport-http-oauth').TokenStrategy;
//var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var GitlabStrategy = require('passport-gitlab').Strategy;

passport.use('gitlab', new GitlabStrategy({
    clientID: '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e',
    clientSecret: '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857',
    gitlabURL : 'https://gitlab.eecs.umich.edu',
    callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
  },
  function(token, tokenSecret, profile, done) {
      console.log('fuck');
      console.log('Provider: ' + profile.provider);
      console.log('ID: ' + profile.id);
      console.log('DName: ' + profile.displayName);
  //  User.findOrCreate({ id: profile.id }, function (err, user) {
  //    return done(err, user);
  //  });
      return done(none, {});
  }
));

/*
passport.use('gitlab', new OAuth2Strategy({
    authorizationURL: 'https://gitlab.eecs.umich.edu/oauth/authorize',
    tokenURL: 'https://gitlab.eecs.umich.edu/oauth/token',
    clientID: '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e',
    clientSecret: '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857',
    callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
  },
  function(accessToken, refreshToken, profile, done) {
      console.log('Provider: ' + profile.provider);
      console.log('ID: ' + profile.id);
      console.log('DName: ' + profile.displayName);
  }
));
 */

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/gitlab', passport.authenticate('gitlab'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/gitlab/callback',
 // function(req, res, next) {
 //   console.log("[OAuth2:redirect:query]:", JSON.stringify(req.query));
 //   console.log("[OAuth2:redirect:body]:", JSON.stringify(req.body));
 // },
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("[OAuth2:redirect:query]:", JSON.stringify(req.query));
    console.log("[OAuth2:redirect:body]:", JSON.stringify(req.body));
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  // passport.authenticate('gitlab', { successRedirect: '/',
                                    // failureRedirect: '/login' }));

app.get('/login', function(req, res) {
    res.send('<a href="/auth/gitlab">Log In with OAuth 2.0 Provider</a>');
});

app.get('/',
  passport.authenticate('gitlab', {session: false}),
  function(req, res) {
    res.send('<h1>Logged in!</h1>');
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



/*
passport.use('gitlab', new OAuthStrategy({
    requestTokenURL: 'https://gitlab.eecs.umich.edu/oauth/request_token',
    accessTokenURL: 'https://gitlab.eecs.umich.edu/oauth/access_token',
    userAuthorizationURL: 'https://gitlab.eecs.umich.edu/oauth/authorize',
    consumerKey: '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e',
    consumerSecret: '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857',
    callbackURL: 'https://127.0.0.1/auth/gitlab/callback'
  },
  function(token, tokenSecret, profile, done) {
      console.log('Provider: ' + profile.provider);
      console.log('ID: ' + profile.id);
      console.log('DName: ' + profile.displayName);
  }
));


app.get('/auth/gitlab', passport.authenticate('gitlab'));

passport.use('token', new TokenStrategy(
  function(consumerKey, done) {
    Consumer.findOne({ key: consumerKey }, function (err, consumer) {
      if (err) { return done(err); }
      if (!consumer) { return done(null, false); }
      return done(null, consumer, consumer.secret);
    });
  },
  function(accessToken, done) {
    AccessToken.findOne({ token: accessToken }, function (err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }
      Users.findById(token.userId, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // fourth argument is optional info.  typically used to pass
        // details needed to authorize the request (ex: `scope`)
        return done(null, user, token.secret, { scope: token.scope });
      });
    });
  },
  function(timestamp, nonce, done) {
    // validate the timestamp and nonce as necessary
    done(null, true)
  }
));
 */
