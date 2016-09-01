'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Server = function (_AbstractComponent) {
	_inherits(Server, _AbstractComponent);

	function Server() {
		_classCallCheck(this, Server);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Server).apply(this, arguments));
	}

	_createClass(Server, [{
		key: 'setup',
		value: function setup(app) {
			var server = _http2.default.createServer(app);
			this.set(server);
		}
	}, {
		key: 'run',
		value: function run(app) {

			app.use(function (err, req, res, next) {
				console.log("ERROR", err.stack);
				res.status(500).send(err);
			});

			process.on('uncaughtException', function (er) {
				console.error(er.stack);
				process.exit(1);
			});

			var server = this.get();
			var port = app.get("port");

			server.listen(port);
			server.on('error', function (error) {
				if (error.syscall !== 'listen') {
					throw error;
				}

				var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

				// handle specific listen errors with friendly messages
				switch (error.code) {
					case 'EACCES':
						console.error(bind + ' requires elevated privileges');
						process.exit(1);
						break;
					case 'EADDRINUSE':
						console.error(bind + ' is already in use');
						process.exit(1);
						break;
					default:
						throw error;
				}
			});
			server.on('listening', function () {
				var addr = server.address();
				var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
				console.log('Listening on ' + bind);
			});
		}
	}]);

	return Server;
}(_abstractComponent2.default);

exports.default = Server;