'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import logger from 'logger';


var App = function (_AbstractComponent) {
	_inherits(App, _AbstractComponent);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
	}

	_createClass(App, [{
		key: 'setup',
		value: function setup() {
			this.setupApp();
			this.setupAppPresets();
		}
	}, {
		key: 'setupApp',
		value: function setupApp() {
			this.set((0, _express2.default)());
		}
	}, {
		key: 'setupAppPresets',
		value: function setupAppPresets() {

			var app = this.get();
			/*
   	Tell frontend what's available for REST and hook into the OPTIONS resource
    */
			app.use(function (req, res, next) {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

				// intercept OPTIONS method
				if ('OPTIONS' == req.method) {
					res.sendStatus(200);
				} else {
					next();
				}
			});

			var port = process.env.PORT || this.getParam("port");
			if (!port) {
				port = '3000';
			}

			port = this.normalizePort(port);
			/*
    For Localhost
    */
			app.set('views', _path2.default.join(this.getBasePath(), 'views'));
			app.set('view engine', 'jade');

			// uncomment after placing your favicon in /public
			//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
			//app.use(logger('dev'));
			app.use(_bodyParser2.default.json());
			app.use(_bodyParser2.default.urlencoded({ extended: false }));
			app.use(_express2.default.static(_path2.default.join(this.getBasePath(), "public")));

			app.set('port', port);
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
	}]);

	return App;
}(_abstractComponent2.default);

exports.default = App;