'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EpilogueLiveEdit = function (_AbstractComponent) {
	_inherits(EpilogueLiveEdit, _AbstractComponent);

	function EpilogueLiveEdit() {
		_classCallCheck(this, EpilogueLiveEdit);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EpilogueLiveEdit).apply(this, arguments));
	}

	_createClass(EpilogueLiveEdit, [{
		key: 'requiredComponents',
		value: function requiredComponents() {
			return ['epilogue', 'live-edit'];
		}
	}, {
		key: 'setup',
		value: function setup(epilogue, liveEdit) {
			var _this2 = this;

			if (!epilogue.routes) {
				return true;
			}

			_lodash2.default.each(epilogue.routes, function (route, name) {
				_this2.setupRouteHook(name, route, liveEdit);
			}, this);
		}
	}, {
		key: 'setupRouteHook',
		value: function setupRouteHook(namespace, route, liveEdit) {
			route.update.send.before(function (req, res, context) {
				liveEdit.broadcastPUT(namespace, context.attributes.id, context.attributes);
				return context.continue;
			});
			route.create.send.before(function (req, res, context) {
				liveEdit.broadcastPOST(namespace, context.attributes);
				return context.continue;
			});
			route.delete.send.before(function (req, res, context) {
				liveEdit.broadcastDELETE(namespace, context.criteria.id, true);
				return context.continue;
			});
		}
	}]);

	return EpilogueLiveEdit;
}(_abstractComponent2.default);

exports.default = EpilogueLiveEdit;