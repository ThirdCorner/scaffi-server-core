'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nodeIp = require("ip");

var App = function (_AbstractComponent) {
	_inherits(App, _AbstractComponent);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	}

	_createClass(App, [{
		key: 'getClassName',
		value: function getClassName() {
			return "app";
		}
	}, {
		key: 'setup',
		value: function setup() {
			this.setupApp();
			this.setupAppPresets();
			this.attachSendHandlers();
		}
	}, {
		key: 'setupApp',
		value: function setupApp() {
			this.set((0, _express2.default)());
		}
	}, {
		key: 'setupAppPresets',
		value: function setupAppPresets() {
			var _this2 = this;

			var app = this.get();

			var port = process.env.PORT || this.getParam("port");
			if (!port) {
				console.log("(reverting to serverLocalhostPort because no port was set)");
				port = this.getConfig("serverLocalhostPort");
			}

			port = this.normalizePort(port);

			var ports = ["4000", "4001", port.toString()];
			var whitelist = ["file://", "gap://ready"];
			_lodash2.default.each(ports, function (p) {
				whitelist.push("http://localhost:" + p);
			});

			if (this.getParam("whitelist")) {
				var extraWhitelists = this.getParam("whitelist");
				if (_lodash2.default.isString(extraWhitelists)) {
					extraWhitelists = [extraWhitelists];
				}

				if (_lodash2.default.isArray(extraWhitelists)) {
					whitelist = whitelist.concat(extraWhitelists);
				}
			}

			if (this.getConfig("environment") === "localhost") {
				_lodash2.default.each(ports, function (p) {
					whitelist.push("http://" + nodeIp.address() + ":" + p);
				});
			}

			var corsOptions = {
				origin: function origin(_origin, callback) {
					var originIsWhitelisted = true;
					/*
     	Param could be null or true, so
      */
					if (_this2.getParam("enable-cors") === true) {
						originIsWhitelisted = whitelist.indexOf(_origin) !== -1;
					}

					var msg = 'Bad Request';
					if (_this2.getConfig("environment") !== "production") {
						msg += "; CORS ISSUE; Origin is: " + _origin;
					}
					callback(originIsWhitelisted || !_origin ? null : msg, originIsWhitelisted);
				},
				/*
    	Content-Range is required for epilogue
     */
				exposedHeaders: ["Access-Control-Allow-Credentials", "Access-Control-Allow-Origins", "Cookie", "Access-Control-Allow-Headers", "Content-Type", "Authorization", "Content-Length", "X-Requested-With", "X-Forwarded-Proto", "Pragma", "Cache-Control", "Content-Range"],
				credentials: true
			};

			if (this.getConfig("enable-cors") || this.getConfig("environment") === "localhost") {
				app.use((0, _cors2.default)(corsOptions));
			}

			/*
   	Make sure that deep nested objects are turned into objects
    */
			app.use(function (req, res, next) {
				if (req.query) {
					_lodash2.default.each(req.query, function (value, name) {
						try {
							req.query[name] = JSON.parse(value);
						} catch (e) {}
					});
				}

				next();
			});
			/*
   	Tell frontend what's available for REST and hook into the OPTIONS resource
    */
			// app.use((req, res, next) => {
			// 	/*
			// 		This is so cookies will work. We have to specify a specific address to get through CORS
			// 	 */
			// 	res.header('Access-Control-Allow-Credentials', true);
			//
			//
			// 	/*
			// 		Had the following
			// 	 var origins = ["http://localhost:" + this.getConfig("uiLocalhostPort"),  "http://localhost:4000", "http://localhost:4001" ];
			// 	 res.header("Access-Control-Allow-Origin", origins);
			//
			// 	    Chrome wouldn't let it pass because of multilpe headers
			//
			// 	    If I set to just "http://localhost:" + this.getConfig("uiLocalhostPort", then I can't run multiple localhost browsersync sessions
			// 	    So setting to * for now, and I"ll have to try adding cookie stuff later to see if this will work.
			// 	 */
			//
			//
			// 	res.header("Access-Control-Allow-Origin", '*');
			//
			//
			//
			// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Pragma, Cache-Control");
			// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			//
			// 	/*
			// 		Add  query string parser; This will parse any query values for a json structure and convert to object.
			// 	 */
			// 	if(req.query) {
			// 		_.each(req.query, (value, name)=>{
			// 			try {
			// 				req.query[name] = JSON.parse(value);
			// 			} catch(e){
			//
			// 			}
			// 		})
			// 	}
			//
			// 	// intercept OPTIONS method
			// 	if ('OPTIONS' == req.method) {
			// 		res.sendStatus(200);
			// 	}
			// 	else {
			// 		next();
			// 	}
			// });

			/*
    For Localhost
    */
			app.set('views', _path2.default.join(this.getBasePath(), 'views'));
			app.set('view engine', 'jade');

			// uncomment after placing your favicon in /public
			//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
			//app.use(logger('dev'));
			app.use(_bodyParser2.default.json({ limit: this.getConfig('transferLimit') || '50mb' }));
			app.use(_bodyParser2.default.urlencoded({ limit: this.getConfig('transferLimit') || '50mb', extended: false }));
			app.use(_express2.default.static(_path2.default.join(this.getBasePath(), "public")));

			app.set('port', port);
		}
	}, {
		key: 'attachSendHandlers',
		value: function attachSendHandlers() {
			this.get().use(function (req, res, next) {
				res.sendSuccess = function (data) {
					if (data && !_lodash2.default.isObject(data)) {
						data = {
							response: data
						};
					}

					res.send(data);
				};
				res.sendForbidden = function (errorMsg, stack) {
					res.status(403).send({
						errorType: "forbidden",
						message: errorMsg,
						stack: stack
					});
				};
				res.sendUnauthorized = function (errorMsg, stack) {
					res.status(401).send({
						errorType: "unauthorized",
						message: errorMsg,
						stack: stack
					});
				};
				res.sendError = function (errorMsg, stack) {
					if (!stack && errorMsg && errorMsg instanceof Error) {
						stack = errorMsg.stack;
						errorMsg = errorMsg.message;
					}
					res.status(500).send({
						errorType: "error",
						message: errorMsg,
						stack: stack
					});
				};
				res.sendNotFound = function (errorMsg, stack) {
					res.status(404).send({
						errorType: "not_found",
						message: errorMsg,
						stack: stack
					});
				};

				next();
			});
		}
	}, {
		key: 'normalizePort',
		value: function normalizePort(val) {
			var port = parseInt(val, 10);

			if (isNaN(port)) {
				// named pipe
				return val;
			}

			if (port >= 0) {
				// port number
				return port;
			}

			return false;
		}
	}, {
		key: 'run',
		value: function run() {

			var router = _express2.default.Router();

			/* GET home page. */
			router.get('/', function (req, res, next) {
				res.sendFile(_path2.default.join(_appRootPath2.default.toString(), 'public', 'index.html'));
			});

			this.get().all("api/*", function (req, res) {
				res.status(404).send({ message: "Unknown Route" });
			});

			/*
    All unknown routes, just send the index?????
    */
			this.get().all('*', function (req, res, next) {
				res.sendFile(_path2.default.join(_appRootPath2.default.toString(), 'public', 'index.html'));
			});

			// catch 404 and forward to error handler
			this.get().use(function (req, res, next) {
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			});

			// error handlers

			// development error handler
			// will print stacktrace
			if (this.get().get('env') === 'development') {
				this.get().use(function (err, req, res, next) {
					res.status(err.status || 500);
					res.send({
						message: err.message,
						error: err
					});
				});
			}

			// production error handler
			// no stacktraces leaked to user
			this.get().use(function (err, req, res, next) {
				res.status(err.status || 500);
				res.send({
					message: err.message,
					error: err
				});
			});
		}
	}]);

	return App;
}(_abstractComponent2.default);

exports.default = new App();