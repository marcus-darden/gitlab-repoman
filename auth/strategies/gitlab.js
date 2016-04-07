const GitlabStrategy = require('passport-gitlab').Strategy;
const config = require('../../config');
const error = require('../../helpers/error');
const gitlabHelper = require('../../helpers/gitlab');

const gitlabOptions = {
  clientID: config.GITLAB_APP_KEY,
  clientSecret: config.GITLAB_APP_SECRET,
  gitlabURL: config.GITLAB_URL,
  callbackURL: config.GITLAB_CALLBACK_URL,
};

function gitlabVerify(token, tokenSecret, profile, done) {
  return gitlabHelper.login(token, profile).then((_user) => {
    const u = _user.get();
    u.oauth_token = token;
    console.log(`OAUTH_TOKEN: ${token}`);
    return done(null, u);
  }).catch(error.helper(done, 'Unable to log in to Gitlab server.'));
}

module.exports = new GitlabStrategy(gitlabOptions, gitlabVerify);
