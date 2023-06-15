"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = exports.getUserPlaylists = exports.getTracks = exports.createPlaylistRequest = exports.callback = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _setlistfm = _interopRequireDefault(require("./setlistfm"));
var _server = require("./server");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
_dotenv["default"].config();
var _process$env = process.env,
  SPOTIFY_CLIENT = _process$env.SPOTIFY_CLIENT,
  SPOTIFY_SECRET = _process$env.SPOTIFY_SECRET;
var callback = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var code, tokenResponse, accessToken, refreshToken;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          code = req.query.code;
          _context.prev = 1;
          _context.next = 4;
          return (0, _axios["default"])({
            url: "https://accounts.spotify.com/api/token",
            method: "POST",
            data: {
              grant_type: "authorization_code",
              code: code,
              redirect_uri: "http://localhost:".concat(_server.PORT, "/callback"),
              client_id: SPOTIFY_CLIENT,
              client_secret: SPOTIFY_SECRET
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic ".concat(new Buffer.from("".concat(SPOTIFY_CLIENT, ":").concat(SPOTIFY_SECRET)).toString("base64"))
            }
          });
        case 4:
          tokenResponse = _context.sent;
          accessToken = tokenResponse.data.access_token;
          refreshToken = tokenResponse.data.refreshToken;
          req.session.accessToken = accessToken;
          res.redirect("/search");
          // process.exit();
          _context.next = 15;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.error("Error:", _context.t0.message);
          res.status(500).send("An error occurred");
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 11]]);
  }));
  return function callback(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.callback = callback;
var getPlaylistItems = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(playlistId, accessToken) {
    var _yield$axios, items;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _axios["default"])({
            url: "https://api.spotify.com/v1/playlists/".concat(playlistId, "/tracks"),
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            }
          });
        case 2:
          _yield$axios = _context2.sent;
          items = _yield$axios.data.items;
          return _context2.abrupt("return", items);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getPlaylistItems(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getTrackUris = function getTrackUris(tracks, limit, existingIds) {
  // If there are more than x tracks, sort by popularity and use the first x
  var uris = [];
  if (tracks.length > limit) {
    uris = (0, _uniq["default"])(tracks.sort(function (a, b) {
      return b.popularity - a.popularity;
    })).filter(function (response) {
      return existingIds.indexOf(response.uri) === -1;
    }).slice(0, limit).map(function (response) {
      return response.uri;
    });
  } else {
    uris = (0, _uniq["default"])(tracks.map(function (response) {
      return response.uri;
    }));
  }
  uris = existingIds.concat(uris);
  console.log("Adding ".concat((0, _uniq["default"])(uris).length - existingIds.length, " tracks to playlist..."));
  return uris;
};
var getCurrentUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(accessToken) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _axios["default"])({
            url: "https://api.spotify.com/v1/me",
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            }
          });
        case 3:
          return _context3.abrupt("return", _context3.sent);
        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.log("getCurrentUser: ", _context3.t0);
          return _context3.abrupt("return", _context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 6]]);
  }));
  return function getCurrentUser(_x5) {
    return _ref3.apply(this, arguments);
  };
}();
var createPlaylist = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(accessToken, name, userId) {
    var _yield$axios2, data;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _axios["default"])({
            url: "https://api.spotify.com/v1/users/".concat(userId, "/playlists"),
            method: "POST",
            data: {
              name: name
            },
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            }
          });
        case 2:
          _yield$axios2 = _context4.sent;
          data = _yield$axios2.data;
          return _context4.abrupt("return", data);
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function createPlaylist(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var createPlaylistRequest = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _yield$getCurrentUser, id, data;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (req.session.accessToken) {
            _context5.next = 3;
            break;
          }
          res.redirect("/login");
          return _context5.abrupt("return");
        case 3:
          _context5.next = 5;
          return getCurrentUser(req.session.accessToken);
        case 5:
          _yield$getCurrentUser = _context5.sent;
          id = _yield$getCurrentUser.data.id;
          _context5.next = 9;
          return createPlaylist(req.session.accessToken, req.body.name, id);
        case 9:
          data = _context5.sent;
          console.log("Created playlist ".concat(req.body.name, "!"));
          res.send(data);
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function createPlaylistRequest(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.createPlaylistRequest = createPlaylistRequest;
var addToPlaylist = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(playlistId, uris, accessToken) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _axios["default"])({
            url: "https://api.spotify.com/v1/playlists/".concat(playlistId, "/tracks"),
            method: "POST",
            data: {
              uris: uris
            },
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            }
          });
        case 2:
          console.log("Added!");
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function addToPlaylist(_x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();
var getTracks = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(artistName, tracks, accessToken) {
    var promises, results, foundTracks;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          promises = [];
          tracks.forEach( /*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(_ref8) {
              var name;
              return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    name = _ref8.name;
                    console.log("Searching for ".concat(artistName, " ").concat(name));
                    promises.push((0, _axios["default"])({
                      method: "GET",
                      url: "https://api.spotify.com/v1/search?q=".concat(encodeURIComponent("".concat(artistName, " ").concat(name)), "&type=track"),
                      headers: {
                        Authorization: "Bearer ".concat(accessToken)
                      },
                      meta: {
                        artistName: artistName,
                        name: name
                      }
                    }));
                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function (_x17) {
              return _ref9.apply(this, arguments);
            };
          }());
          _context8.next = 4;
          return Promise.all(promises);
        case 4:
          results = _context8.sent;
          foundTracks = [];
          results.forEach(function (_ref10) {
            var data = _ref10.data,
              meta = _ref10.config.meta;
            if (data.tracks.items.find(function (t) {
              return t.artists.find(function (a) {
                return a.name.replace("’", "").toLowerCase() === meta.artistName.toLowerCase();
              }) && t.name.toLowerCase() === meta.name.toLowerCase();
            })) {
              foundTracks.push(data.tracks.items.find(function (t) {
                return t.artists.find(function (a) {
                  return a.name.toLowerCase() === meta.artistName.toLowerCase();
                }) && t.name.toLowerCase() === meta.name.toLowerCase();
              }));
            }
          });
          console.log("".concat(foundTracks.length, " results found out of ").concat(promises.length));
          return _context8.abrupt("return", foundTracks);
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function getTracks(_x14, _x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();
exports.getTracks = getTracks;
var search = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$body, artistName, playlistId, _yield$getCurrentUser2, id, result, tracks, limit, spotifyTracks, items, existingIds, uris;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          if (req.session.accessToken) {
            _context9.next = 4;
            break;
          }
          res.redirect("/login");
          return _context9.abrupt("return");
        case 4:
          artistName = req.body.artist;
          playlistId = req.body.playlistId;
          if (!((_req$body = req.body) !== null && _req$body !== void 0 && _req$body.playlistName)) {
            _context9.next = 16;
            break;
          }
          _context9.next = 9;
          return getCurrentUser(req.session.accessToken);
        case 9:
          _yield$getCurrentUser2 = _context9.sent;
          id = _yield$getCurrentUser2.data.id;
          _context9.next = 13;
          return createPlaylist(req.session.accessToken, req.body.playlistName, id);
        case 13:
          result = _context9.sent;
          console.log(result);
          playlistId = result.id;
        case 16:
          console.log("playlistId", playlistId);
          _context9.next = 19;
          return (0, _setlistfm["default"])(artistName);
        case 19:
          tracks = _context9.sent;
          limit = 10;
          if (playlistId) {
            _context9.next = 24;
            break;
          }
          res.send(422);
          return _context9.abrupt("return");
        case 24:
          if (req.body.limit) {
            limit = Number(req.body.limit);
          }
          if (req.session.accessToken) {
            _context9.next = 28;
            break;
          }
          res.redirect("/login");
          return _context9.abrupt("return");
        case 28:
          _context9.next = 30;
          return getTracks(artistName, tracks, req.session.accessToken);
        case 30:
          spotifyTracks = _context9.sent;
          _context9.next = 33;
          return getPlaylistItems(playlistId, req.session.accessToken);
        case 33:
          items = _context9.sent;
          existingIds = items.filter(function (i) {
            return i.track.artists.find(function (a) {
              return a.name.toLowerCase() === artistName.toLowerCase();
            });
          }).map(function (i) {
            return i.track.uri;
          });
          uris = getTrackUris(spotifyTracks, limit, existingIds);
          _context9.next = 38;
          return addToPlaylist(playlistId, uris, req.session.accessToken);
        case 38:
          res.redirect("/search?success=1");
          _context9.next = 45;
          break;
        case 41:
          _context9.prev = 41;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0.message);
          res.send(500);
        case 45:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 41]]);
  }));
  return function search(_x18, _x19) {
    return _ref11.apply(this, arguments);
  };
}();
exports.search = search;
var getPlaylists = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(url, accessToken) {
    var _yield$axios3, data;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _axios["default"])({
            url: url,
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            }
          });
        case 2:
          _yield$axios3 = _context10.sent;
          data = _yield$axios3.data;
          return _context10.abrupt("return", {
            data: data
          });
        case 5:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function getPlaylists(_x20, _x21) {
    return _ref12.apply(this, arguments);
  };
}();
var getUserPlaylists = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _yield$getCurrentUser3, id, allData, _yield$getPlaylists, data, promises, i, responses;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          if (req.session.accessToken) {
            _context11.next = 4;
            break;
          }
          res.redirect("/login");
          return _context11.abrupt("return");
        case 4:
          _context11.next = 6;
          return getCurrentUser(req.session.accessToken);
        case 6:
          _yield$getCurrentUser3 = _context11.sent;
          id = _yield$getCurrentUser3.data.id;
          allData = [];
          _context11.next = 11;
          return getPlaylists("https://api.spotify.com/v1/users/".concat(id, "/playlists?limit=50"), req.session.accessToken);
        case 11:
          _yield$getPlaylists = _context11.sent;
          data = _yield$getPlaylists.data;
          allData.push(data.items);
          if (!((data === null || data === void 0 ? void 0 : data.total) > 50)) {
            _context11.next = 21;
            break;
          }
          promises = [];
          for (i = 0; (i + 1) * 50 < data.total; i += 1) {
            promises.push(getPlaylists("https://api.spotify.com/v1/users/".concat(id, "/playlists?limit=50&offset=").concat((i + 1) * 50), req.session.accessToken));
          }
          _context11.next = 19;
          return Promise.all(promises);
        case 19:
          responses = _context11.sent;
          responses.forEach(function (_ref14) {
            var data = _ref14.data;
            allData.push(data.items);
          });
        case 21:
          return _context11.abrupt("return", res.send(allData.flat(1)));
        case 24:
          _context11.prev = 24;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0.message);
          res.send(_context11.t0.message);
        case 28:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 24]]);
  }));
  return function getUserPlaylists(_x22, _x23) {
    return _ref13.apply(this, arguments);
  };
}();
exports.getUserPlaylists = getUserPlaylists;