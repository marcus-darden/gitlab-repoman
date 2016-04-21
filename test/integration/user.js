// jscs:disable maximumNumberOfLines

'use strict';

const chai = require('chai');
const request = require('supertest');
// const Validator = require('jsonschema').Validator;

const app = require('../../index');
// const auth = require('../../helpers/auth');
// const config = require('../../config');
const init = require('./init');
const userHelper = require('../../helpers/user');

const should = chai.should();

describe('/mmdarden', () => {
  before((done) => {
    init.database().then(() => {
      done();
    });
  });

  describe('GET', () => {
    it('should return a 401 if not authenticated', (done) => {
      request(app)
        .get('/mmdarden')
        .expect(401, done);
    });

    it('should return a 401 if bad authentication', (done) => {
      request(app)
        .get('/mmdarden')
        .set('Authorization', 'Bearer 9999')
        .expect(401, done);
    });

    it('should return a 404 if the user is not found', (done) => {
      let user;
      userHelper.get('no-user').then((_u) => {
        user = _u;
      });

      request(app)
        .get('/bad-username')
        .set('Authorization', 'Bearer 1')
        .expect(404, done);
    });
/*
    it('should return a 404 if access is denied', (done) => {
      let user;
      userHelper.get('mmdarden').then((_u) => {
        user = _u;
      });

      request(app)
        .get('/mmdarden')
        .set('Authorization', 'Bearer 2')
        .expect(404, done);
    });

    it('should return a 422 if the ID is undecodable', function (done) {
      request(app)
        .get('/:username/abc123')
        .set('Authorization', 'Bearer 1')
        .expect(422, done);
    });

    it('should return a 200 and a user profile', function (done) {
      var userId = 1;

      request(app)
        .get('/:username')
        .set('Authorization', 'Bearer ' + userId.toString())
        .expect(200)
        .expect('Content-Type', /^application\/json/)
        .end(function (err, res) {
          if (err) {
            done(err);
            return;
          }

          validator.validate(res.body, schema, { throwError: true });

          userHelper.getById(userId).then(function (user) {
            res.body.should.eql(userHelper.prep(user));
            done();
          }).catch(function (err) {
            done(err);
          });
        });
    });

    it('should return a 200 and a user profile (passed)', function (done) {
      var userId = 2;
      var userScope = scope.encode(userId, config.scope.userId);

      request(app)
        .get('/:username/' + userScope)
        .set('Authorization', 'Bearer 1')
        .expect(200)
        .expect('Content-Type', /^application\/json/)
        .end(function (err, res) {
          if (err) {
            done(err);
            return;
          }

          validator.validate(res.body, schema, { throwError: true });

          userHelper.getById(userId).then(function (user) {
            res.body.should.eql(userHelper.prep(user));
            done();
          }).catch(function (err) {
            done(err);
          });
        });
    });
  });

  describe('PUT', function () {
    it('should return a 401 if not authenticated', function (done) {
      request(app)
        .put('/:username')
        .expect(401, done);
    });

    it('should return a 401 if bad authentication', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 9999')
        .expect(401, done);
    });

    it('should return a 403 if the old password is incorrect', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 1')
        .send({ password: { old: 'old', new: 'new', confirmation: 'new' }})
        .expect(403, done);
    });

    it('should return a 404 if the user is not found', function (done) {
      var userScope = scope.encode(9999, config.scope.userId);

      request(app)
        .put('/:username/' + userScope)
        .set('Authorization', 'Bearer 1')
        .send({ email: 'new@example.com' })
        .expect(404, done);
    });

    it('should return a 404 if access is denied', function (done) {
      var userScope = scope.encode(1, config.scope.userId);

      request(app)
        .get('/:username/' + userScope)
        .set('Authorization', 'Bearer 2')
        .send({ email: 'new@example.com' })
        .expect(404, done);
    });

    it('should return a 406 if the content type is bad', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 1')
        .set('Content-Type', 'text/html')
        .expect(406, done);
    });

    it('should return a 409 if the email is in use', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 1')
        .send({ email: 'james@nsbasic.com' })
        .expect(409, done);
    });

    it('should return a 422 if the ID is undecodable', function (done) {
      request(app)
        .put('/:username/abc123')
        .set('Authorization', 'Bearer 1')
        .expect(422, done);
    });

    it('should return a 422 on a confirm mismatch', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 1')
        .send({ password: { old: 'old', new: 'new1', confirmation: 'new' }})
        .expect(422, done);
    });

    it('should return a 422 if the schema is invalid', function (done) {
      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer 1')
        .send({ password: { new: 'new', confirmation: 'new' }})
        .expect(422, done);
    });

    it('should return a 200 and a user profile', function (done) {
      var userId = 1;
      var email = 'test@nsbasic.com';
      var password = 'another';

      request(app)
        .put('/:username')
        .set('Authorization', 'Bearer ' + userId.toString())
        .send({
          email: email,
          password: {
            old: 'password',
            new: password,
            confirmation: password
          }
        })
        .expect(200, function (err, res) {
          if (err) {
            done(err);
            return;
          }

          validator.validate(res.body, schema, { throwError: true });
          res.body.email.should.equal(email);

          userHelper.getById(userId).then(function (user) {
            var hash = user.password;

            res.body.should.eql(userHelper.prep(user));

            return auth.compare(password, hash);
          }).then(function (result) {
            if (result) {
              done();
            } else {
              done(new Error('New password does not match user password.'));
            }
          }).catch(function (err) {
            done(err);
          });
        });
    });

    it('should return a 200 and a user profile (passed)', function (done) {
      var userId = 2;
      var userScope = scope.encode(userId, config.scope.userId);
      var email = 'test2@nsbasic.com';

      request(app)
        .put('/:username/' + userScope)
        .set('Authorization', 'Bearer 1')
        .send({ email: email })
        .expect(200, function (err, res) {
          if (err) {
            done(err);
            return;
          }

          validator.validate(res.body, schema, { throwError: true });
          res.body.email.should.equal(email);

          userHelper.getById(userId).then(function (user) {
            res.body.should.eql(userHelper.prep(user));
            done();
          }).catch(function (err) {
            done(err);
          });
        });
    });
  });

  describe('DELETE', function () {
    it('should return a 401 if not authenticated', function (done) {
      request(app)
        .delete('/:username')
        .expect(401, done);
    });

    it('should return a 401 if bad authentication', function (done) {
      request(app)
        .delete('/:username')
        .set('Authorization', 'Bearer 9999')
        .expect(401, done);
    });

    it('should return a 404 if the user is not found', function (done) {
      var userScope = scope.encode(9999, config.scope.userId);

      request(app)
        .delete('/:username/' + userScope)
        .set('Authorization', 'Bearer 1')
        .expect(404, done);
    });

    it('should return a 404 if access is denied', function (done) {
      var userScope = scope.encode(1, config.scope.userId);

      request(app)
        .delete('/:username/' + userScope)
        .set('Authorization', 'Bearer 2')
        .expect(404, done);
    });

    it('should return a 422 if the ID is undecodable', function (done) {
      request(app)
        .delete('/:username/abc123')
        .set('Authorization', 'Bearer 1')
        .expect(422, done);
    });

    it('should return a 204', function (done) {
      var userId = 2;

      request(app)
        .delete('/:username')
        .set('Authorization', 'Bearer ' + userId.toString())
        .expect(204)
        .end(function (err, res) {
          if (err) {
            done(err);
            return;
          }

          userHelper.getById(userId).then(function (user) {
            should.equal(user, null);
            done();
          }).catch(function (err) {
            done(err);
          });
        });
    });

    it('should return a 204 (passed)', function (done) {
      var userId = 3;
      var userScope = scope.encode(userId, config.scope.userId);

      request(app)
        .delete('/:username/' + userScope)
        .set('Authorization', 'Bearer 1')
        .expect(204)
        .end(function (err, res) {
          if (err) {
            done(err);
            return;
          }

          userHelper.getById(userId).then(function (user) {
            should.equal(user, null);
            done();
          }).catch(function (err) {
            done(err);
          });
        });
    });
  */
  });
});
