"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));

var _http = _interopRequireDefault(require("http"));

var _next = _interopRequireDefault(require("../next"));

function start(_x, _x2, _x3) {
  return _start.apply(this, arguments);
}

function _start() {
  _start = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(serverOptions, port, hostname) {
    var app, srv;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = (0, _next.default)(serverOptions);
            _context.next = 3;
            return app.prepare();

          case 3:
            srv = _http.default.createServer(app.getRequestHandler());
            _context.next = 6;
            return new _promise.default(function (resolve, reject) {
              // This code catches EADDRINUSE error if the port is already in use
              srv.on('error', reject);
              srv.on('listening', function () {
                return resolve();
              });
              srv.listen(port, hostname);
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _start.apply(this, arguments);
}