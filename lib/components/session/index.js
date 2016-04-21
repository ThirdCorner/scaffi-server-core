'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SessionConnect = function (_AbstractComponent) {
	_inherits(SessionConnect, _AbstractComponent);

	function SessionConnect() {
		_classCallCheck(this, SessionConnect);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(SessionConnect).apply(this, arguments));
	}

	_createClass(SessionConnect, [{
		key: 'requiredComponents',
		value: function requiredComponents() {
			return ['app', 'redis-connect'];
		}
	}, {
		key: 'requiredParams',
		value: function requiredParams() {
			return ['secretKey', 'resave', 'saveUninitialized'];
		}
	}, {
		key: 'setup',
		value: function setup(app, redisConnect) {
			var obj = {
				secret: this.getParam("secretKey"),
				store: redisConnect.registerStore(_expressSession2.default),
				cookie: { maxAge: 60000 },
				resave: this.getParam("resave"),
				saveUninitialized: this.getParam("saveUninitialized")
			};
			var createdSession = (0, _expressSession2.default)(obj);
			console.log(createdSession);
			app.use(createdSession);

			this.set(createdSession);
		}
	}]);

	return SessionConnect;
}(_abstractComponent2.default);

exports.default = SessionConnect;