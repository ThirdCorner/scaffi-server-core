'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var express = require('express');

var Router = function (_AbstractComponent) {
	_inherits(Router, _AbstractComponent);

	function Router() {
		_classCallCheck(this, Router);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Router).apply(this, arguments));
	}

	_createClass(Router, [{
		key: 'setup',
		value: function setup(app) {
			var RouterInterface = {
				use: function use(url, route) {
					app.use(url, route);
				},
				get: function get(url, fn) {
					app.get(url + "/:id", function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				},
				post: function post(url, fn) {
					app.post(url, function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				},
				put: function put(url, fn) {
					app.put(url + "/:id", function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				},
				delete: function _delete(url, fn) {
					app.delete(url + "/:id", function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				},
				deleteList: function deleteList(url, fn) {
					app.delete(url, function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				},
				list: function list(url, fn) {
					app.get(url, function (req, res, next) {
						try {
							fn(req, res, next);
						} catch (e) {
							res.sendError(e);
						}
					});
				}
			};

			this.set(RouterInterface);
		}
	}, {
		key: 'run',
		value: function run(app) {
			try {
				require(_path2.default.join(this.getBasePath(), 'routes'))(app, this.get());
			} catch (e) {}

			var router = express.Router();

			/* GET home page. */
			router.get('/', function (req, res, next) {
				res.sendFile(_path2.default.join(_appRootPath2.default.toString(), 'public', 'index.html'));
			});

			this.runFallbacks(app);
		}
	}, {
		key: 'runFallbacks',
		value: function runFallbacks(app) {
			/*
   	All unknown routes, just send the index?????
    */
			app.all('*', function (req, res, next) {
				res.sendFile(_path2.default.join(_appRootPath2.default.toString(), 'public', 'index.html'));
			});

			// catch 404 and forward to error handler
			app.use(function (req, res, next) {
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			});

			// error handlers

			// development error handler
			// will print stacktrace
			if (app.get('env') === 'development') {
				app.use(function (err, req, res, next) {
					res.status(err.status || 500);
					res.send({
						message: err.message,
						error: err
					});
				});
			}

			// production error handler
			// no stacktraces leaked to user
			app.use(function (err, req, res, next) {
				res.status(err.status || 500);
				res.send({
					message: err.message,
					error: err
				});
			});
		}
	}]);

	return Router;
}(_abstractComponent2.default);

exports.default = Router;