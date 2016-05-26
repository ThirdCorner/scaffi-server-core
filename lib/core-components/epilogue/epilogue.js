'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _epilogue = require('epilogue');

var _epilogue2 = _interopRequireDefault(_epilogue);

var _notifyService = require('../../services/notify-service');

var _notifyService2 = _interopRequireDefault(_notifyService);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Epilogue = function (_AbstractComponent) {
	_inherits(Epilogue, _AbstractComponent);

	function Epilogue() {
		_classCallCheck(this, Epilogue);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Epilogue).apply(this, arguments));
	}

	_createClass(Epilogue, [{
		key: 'setup',
		value: function setup(app, db) {

			_epilogue2.default.initialize({
				app: app,
				sequelize: db.connection
			});

			this.setupRoutes(app, db, _epilogue2.default);

			this.setupSocketRoutes(_epilogue2.default);

			this.set(_epilogue2.default);
		}
	}, {
		key: 'setupRoutes',
		value: function setupRoutes(app, db, epilogue) {
			epilogue.routes = {};
			this.loadFiles(_path2.default.join(this.getBasePath(), 'routes', 'epilogue'), function (loadedFile) {
				var routeModel = loadedFile(db, epilogue);
				epilogue.routes[routeModel.model.name] = routeModel;
			});
		}
	}, {
		key: 'setupSocketRoutes',
		value: function setupSocketRoutes(epilogue) {
			if (!epilogue.routes) {
				return true;
			}

			var notify = (0, _notifyService2.default)();
			_lodash2.default.each(epilogue.routes, function (route, namespace) {
				route.update.send.before(function (req, res, context) {
					notify.emitUpdate(namespace, context.attributes.id, context.attributes);
					return context.continue;
				});
				route.create.send.before(function (req, res, context) {
					notify.emitCreate(namespace, context.attributes);
					return context.continue;
				});
				route.delete.send.before(function (req, res, context) {
					notify.emitDelete(namespace, context.criteria.id, true);
					return context.continue;
				});
			}, this);
		}
	}]);

	return Epilogue;
}(_abstractComponent2.default);

exports.default = Epilogue;