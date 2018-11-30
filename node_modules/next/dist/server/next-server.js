"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/get-iterator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _path = require("path");

var _url = require("url");

var _querystring = require("querystring");

var _fs = _interopRequireDefault(require("fs"));

var _render3 = require("./render");

var _router = _interopRequireDefault(require("./router"));

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

var _constants = require("../lib/constants");

var asset = _interopRequireWildcard(require("../lib/asset"));

var envConfig = _interopRequireWildcard(require("../lib/runtime-config"));

var _utils2 = require("../lib/utils");

/* eslint-disable import/first, no-return-await */
var Server =
/*#__PURE__*/
function () {
  function Server() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$dir = _ref.dir,
        dir = _ref$dir === void 0 ? '.' : _ref$dir,
        _ref$staticMarkup = _ref.staticMarkup,
        staticMarkup = _ref$staticMarkup === void 0 ? false : _ref$staticMarkup,
        _ref$quiet = _ref.quiet,
        quiet = _ref$quiet === void 0 ? false : _ref$quiet,
        _ref$conf = _ref.conf,
        conf = _ref$conf === void 0 ? null : _ref$conf;

    (0, _classCallCheck2.default)(this, Server);
    this.dir = (0, _path.resolve)(dir);
    this.quiet = quiet;
    this.router = new _router.default();
    var phase = this.currentPhase();
    this.nextConfig = (0, _config.default)(phase, this.dir, conf);
    this.distDir = (0, _path.join)(this.dir, this.nextConfig.distDir); // Only serverRuntimeConfig needs the default
    // publicRuntimeConfig gets it's default in client/index.js

    var _this$nextConfig = this.nextConfig,
        _this$nextConfig$serv = _this$nextConfig.serverRuntimeConfig,
        serverRuntimeConfig = _this$nextConfig$serv === void 0 ? {} : _this$nextConfig$serv,
        publicRuntimeConfig = _this$nextConfig.publicRuntimeConfig,
        assetPrefix = _this$nextConfig.assetPrefix,
        generateEtags = _this$nextConfig.generateEtags;
    this.buildId = this.readBuildId();
    this.renderOpts = {
      staticMarkup: staticMarkup,
      distDir: this.distDir,
      buildId: this.buildId,
      generateEtags: generateEtags // Only the `publicRuntimeConfig` key is exposed to the client side
      // It'll be rendered as part of __NEXT_DATA__ on the client side

    };

    if (publicRuntimeConfig) {
      this.renderOpts.runtimeConfig = publicRuntimeConfig;
    } // Initialize next/config with the environment configuration


    envConfig.setConfig({
      serverRuntimeConfig: serverRuntimeConfig,
      publicRuntimeConfig: publicRuntimeConfig
    });
    this.setAssetPrefix(assetPrefix);
  }

  (0, _createClass2.default)(Server, [{
    key: "currentPhase",
    value: function currentPhase() {
      return _constants.PHASE_PRODUCTION_SERVER;
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(req, res, parsedUrl) {
      var _this = this;

      // Parse url if parsedUrl not provided
      if (!parsedUrl || (0, _typeof2.default)(parsedUrl) !== 'object') {
        parsedUrl = (0, _url.parse)(req.url, true);
      } // Parse the querystring ourselves if the user doesn't handle querystring parsing


      if (typeof parsedUrl.query === 'string') {
        parsedUrl.query = (0, _querystring.parse)(parsedUrl.query);
      }

      res.statusCode = 200;
      return this.run(req, res, parsedUrl).catch(function (err) {
        if (!_this.quiet) console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  }, {
    key: "getRequestHandler",
    value: function getRequestHandler() {
      return this.handleRequest.bind(this);
    }
  }, {
    key: "setAssetPrefix",
    value: function setAssetPrefix(prefix) {
      this.renderOpts.assetPrefix = prefix ? prefix.replace(/\/$/, '') : '';
      asset.setAssetPrefix(this.renderOpts.assetPrefix);
    }
  }, {
    key: "prepare",
    value: function () {
      var _prepare = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.defineRoutes();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function prepare() {
        return _prepare.apply(this, arguments);
      };
    }() // Backwards compatibility

  }, {
    key: "close",
    value: function () {
      var _close = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function close() {
        return _close.apply(this, arguments);
      };
    }()
  }, {
    key: "setImmutableAssetCacheControl",
    value: function setImmutableAssetCacheControl(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }, {
    key: "generateRoutes",
    value: function () {
      var _generateRoutes = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee7() {
        var _this2 = this;

        var routes;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                routes = [{
                  path: '/_next/static/:path*',
                  fn: function () {
                    var _fn = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee3(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              // The commons folder holds commonschunk files
                              // The chunks folder holds dynamic entries
                              // The buildId folder holds pages and potentially other assets. As buildId changes per build it can be long-term cached.
                              if (params.path[0] === _constants.CLIENT_STATIC_FILES_RUNTIME || params.path[0] === 'chunks' || params.path[0] === _this2.buildId) {
                                _this2.setImmutableAssetCacheControl(res);
                              }

                              p = _path.join.apply(void 0, [_this2.distDir, _constants.CLIENT_STATIC_FILES_PATH].concat((0, _toConsumableArray2.default)(params.path || [])));
                              _context3.next = 4;
                              return _this2.serveStatic(req, res, p);

                            case 4:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3, this);
                    }));

                    return function fn(_x, _x2, _x3) {
                      return _fn.apply(this, arguments);
                    };
                  }()
                }, {
                  path: '/_next/:path*',
                  // This path is needed because `render()` does a check for `/_next` and the calls the routing again
                  fn: function () {
                    var _fn2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee4(req, res, params, parsedUrl) {
                      return _regenerator.default.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.next = 2;
                              return _this2.render404(req, res, parsedUrl);

                            case 2:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4, this);
                    }));

                    return function fn(_x4, _x5, _x6, _x7) {
                      return _fn2.apply(this, arguments);
                    };
                  }()
                }, {
                  // It's very important keep this route's param optional.
                  // (but it should support as many as params, seperated by '/')
                  // Othewise this will lead to a pretty simple DOS attack.
                  // See more: https://github.com/zeit/next.js/issues/2617
                  path: '/static/:path*',
                  fn: function () {
                    var _fn3 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee5(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              p = _path.join.apply(void 0, [_this2.dir, 'static'].concat((0, _toConsumableArray2.default)(params.path || [])));
                              _context5.next = 3;
                              return _this2.serveStatic(req, res, p);

                            case 3:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5, this);
                    }));

                    return function fn(_x8, _x9, _x10) {
                      return _fn3.apply(this, arguments);
                    };
                  }()
                }];

                if (this.nextConfig.useFileSystemPublicRoutes) {
                  // It's very important keep this route's param optional.
                  // (but it should support as many as params, seperated by '/')
                  // Othewise this will lead to a pretty simple DOS attack.
                  // See more: https://github.com/zeit/next.js/issues/2617
                  routes.push({
                    path: '/:path*',
                    fn: function () {
                      var _fn4 = (0, _asyncToGenerator2.default)(
                      /*#__PURE__*/
                      _regenerator.default.mark(function _callee6(req, res, params, parsedUrl) {
                        var pathname, query;
                        return _regenerator.default.wrap(function _callee6$(_context6) {
                          while (1) {
                            switch (_context6.prev = _context6.next) {
                              case 0:
                                pathname = parsedUrl.pathname, query = parsedUrl.query;
                                _context6.next = 3;
                                return _this2.render(req, res, pathname, query, parsedUrl);

                              case 3:
                              case "end":
                                return _context6.stop();
                            }
                          }
                        }, _callee6, this);
                      }));

                      return function fn(_x11, _x12, _x13, _x14) {
                        return _fn4.apply(this, arguments);
                      };
                    }()
                  });
                }

                return _context7.abrupt("return", routes);

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function generateRoutes() {
        return _generateRoutes.apply(this, arguments);
      };
    }()
  }, {
    key: "defineRoutes",
    value: function () {
      var _defineRoutes = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee8() {
        var routes, _arr, _i, method, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, route;

        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.generateRoutes();

              case 2:
                routes = _context8.sent;
                _arr = ['GET', 'HEAD'];
                _i = 0;

              case 5:
                if (!(_i < _arr.length)) {
                  _context8.next = 29;
                  break;
                }

                method = _arr[_i];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context8.prev = 10;

                for (_iterator = (0, _getIterator2.default)(routes); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  route = _step.value;
                  this.router.add(method, route.path, route.fn);
                }

                _context8.next = 18;
                break;

              case 14:
                _context8.prev = 14;
                _context8.t0 = _context8["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context8.t0;

              case 18:
                _context8.prev = 18;
                _context8.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 21:
                _context8.prev = 21;

                if (!_didIteratorError) {
                  _context8.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context8.finish(21);

              case 25:
                return _context8.finish(18);

              case 26:
                _i++;
                _context8.next = 5;
                break;

              case 29:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      return function defineRoutes() {
        return _defineRoutes.apply(this, arguments);
      };
    }()
  }, {
    key: "run",
    value: function () {
      var _run = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee9(req, res, parsedUrl) {
        var fn;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                fn = this.router.match(req, res, parsedUrl);

                if (!fn) {
                  _context9.next = 5;
                  break;
                }

                _context9.next = 4;
                return fn();

              case 4:
                return _context9.abrupt("return");

              case 5:
                if (!(req.method === 'GET' || req.method === 'HEAD')) {
                  _context9.next = 10;
                  break;
                }

                _context9.next = 8;
                return this.render404(req, res, parsedUrl);

              case 8:
                _context9.next = 12;
                break;

              case 10:
                res.statusCode = 501;
                res.end('Not Implemented');

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function run(_x15, _x16, _x17) {
        return _run.apply(this, arguments);
      };
    }()
  }, {
    key: "render",
    value: function () {
      var _render = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee10(req, res, pathname, query, parsedUrl) {
        var html;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!(0, _utils.isInternalUrl)(req.url)) {
                  _context10.next = 2;
                  break;
                }

                return _context10.abrupt("return", this.handleRequest(req, res, parsedUrl));

              case 2:
                if (!(_constants.BLOCKED_PAGES.indexOf(pathname) !== -1)) {
                  _context10.next = 6;
                  break;
                }

                _context10.next = 5;
                return this.render404(req, res, parsedUrl);

              case 5:
                return _context10.abrupt("return", _context10.sent);

              case 6:
                _context10.next = 8;
                return this.renderToHTML(req, res, pathname, query);

              case 8:
                html = _context10.sent;

                if (!(0, _utils2.isResSent)(res)) {
                  _context10.next = 11;
                  break;
                }

                return _context10.abrupt("return");

              case 11:
                if (this.nextConfig.poweredByHeader) {
                  res.setHeader('X-Powered-By', "Next.js 7.0.2");
                }

                return _context10.abrupt("return", (0, _render3.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 13:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function render(_x18, _x19, _x20, _x21, _x22) {
        return _render.apply(this, arguments);
      };
    }()
  }, {
    key: "renderToHTML",
    value: function () {
      var _renderToHTML2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee11(req, res, pathname, query) {
        var out;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return (0, _render3.renderToHTML)(req, res, pathname, query, this.renderOpts);

              case 3:
                out = _context11.sent;
                return _context11.abrupt("return", out);

              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11["catch"](0);

                if (!(_context11.t0.code === 'ENOENT')) {
                  _context11.next = 14;
                  break;
                }

                res.statusCode = 404;
                return _context11.abrupt("return", this.renderErrorToHTML(null, req, res, pathname, query));

              case 14:
                if (!this.quiet) console.error(_context11.t0);
                res.statusCode = 500;
                return _context11.abrupt("return", this.renderErrorToHTML(_context11.t0, req, res, pathname, query));

              case 17:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 7]]);
      }));

      return function renderToHTML(_x23, _x24, _x25, _x26) {
        return _renderToHTML2.apply(this, arguments);
      };
    }()
  }, {
    key: "renderError",
    value: function () {
      var _renderError = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee12(err, req, res, pathname, query) {
        var html;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.renderErrorToHTML(err, req, res, pathname, query);

              case 2:
                html = _context12.sent;
                return _context12.abrupt("return", (0, _render3.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function renderError(_x27, _x28, _x29, _x30, _x31) {
        return _renderError.apply(this, arguments);
      };
    }()
  }, {
    key: "renderErrorToHTML",
    value: function () {
      var _renderErrorToHTML2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee13(err, req, res, pathname, query) {
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", (0, _render3.renderErrorToHTML)(err, req, res, pathname, query, this.renderOpts));

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function renderErrorToHTML(_x32, _x33, _x34, _x35, _x36) {
        return _renderErrorToHTML2.apply(this, arguments);
      };
    }()
  }, {
    key: "render404",
    value: function () {
      var _render2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee14(req, res) {
        var parsedUrl,
            pathname,
            query,
            _args14 = arguments;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                parsedUrl = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : (0, _url.parse)(req.url, true);
                pathname = parsedUrl.pathname, query = parsedUrl.query;
                res.statusCode = 404;
                res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
                return _context14.abrupt("return", this.renderError(null, req, res, pathname, query));

              case 5:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function render404(_x37, _x38) {
        return _render2.apply(this, arguments);
      };
    }()
  }, {
    key: "serveStatic",
    value: function () {
      var _serveStatic2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee15(req, res, path) {
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (this.isServeableUrl(path)) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt("return", this.render404(req, res));

              case 2:
                _context15.prev = 2;
                _context15.next = 5;
                return (0, _render3.serveStatic)(req, res, path);

              case 5:
                return _context15.abrupt("return", _context15.sent);

              case 8:
                _context15.prev = 8;
                _context15.t0 = _context15["catch"](2);

                if (!(_context15.t0.code === 'ENOENT')) {
                  _context15.next = 14;
                  break;
                }

                this.render404(req, res);
                _context15.next = 15;
                break;

              case 14:
                throw _context15.t0;

              case 15:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[2, 8]]);
      }));

      return function serveStatic(_x39, _x40, _x41) {
        return _serveStatic2.apply(this, arguments);
      };
    }()
  }, {
    key: "isServeableUrl",
    value: function isServeableUrl(path) {
      var resolved = (0, _path.resolve)(path);

      if (resolved.indexOf((0, _path.join)(this.distDir) + _path.sep) !== 0 && resolved.indexOf((0, _path.join)(this.dir, 'static') + _path.sep) !== 0) {
        // Seems like the user is trying to traverse the filesystem.
        return false;
      }

      return true;
    }
  }, {
    key: "readBuildId",
    value: function readBuildId() {
      if (!_fs.default.existsSync((0, _path.resolve)(this.distDir, _constants.BUILD_ID_FILE))) {
        throw new Error("Could not find a valid build in the '".concat(this.distDir, "' directory! Try building your app with 'next build' before starting the server."));
      }

      var buildIdPath = (0, _path.join)(this.distDir, _constants.BUILD_ID_FILE);

      var buildId = _fs.default.readFileSync(buildIdPath, 'utf8');

      return buildId.trim();
    }
  }]);
  return Server;
}();

exports.default = Server;