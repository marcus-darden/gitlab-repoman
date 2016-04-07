const error = module.exports = {};

error.handler = function handler(next, message) {
  return e => next(e);
//  return function (e) {
//    if (!(e instanceof error.BaseError)) {
//      e = new error.UnknownError(message, e);
//    }
//  next(e);
};
