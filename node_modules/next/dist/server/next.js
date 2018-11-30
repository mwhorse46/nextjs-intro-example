"use strict";

// This file is used for when users run `require('next')`
module.exports = function (opts) {
  var Server = opts.dev ? require('./next-dev-server').default : require('./next-server').default;
  return new Server(opts);
};