'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractRoute = require('./abstract-route');

var _abstractRoute2 = _interopRequireDefault(_abstractRoute);

var _epilogue = require('../core-components/epilogue/epilogue');

var _epilogue2 = _interopRequireDefault(_epilogue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractEpilogueRoute = function (_AbstractRoute) {
	_inherits(AbstractEpilogueRoute, _AbstractRoute);

	function AbstractEpilogueRoute() {
		_classCallCheck(this, AbstractEpilogueRoute);

		return _possibleConstructorReturn(this, (AbstractEpilogueRoute.__proto__ || Object.getPrototypeOf(AbstractEpilogueRoute)).apply(this, arguments));
	}

	_createClass(AbstractEpilogueRoute, [{
		key: 'afterSetup',
		value: function afterSetup() {
			if (!this.get()) {
				throw new Error("You must set the epilogue resource in this.set() so that hooks can be attached to it.");
			}

			_epilogue2.default.setupErrorRouteOverride(this.get());
			//epilogue.setupSocketRoute(this.get());
		}
	}]);

	return AbstractEpilogueRoute;
}(_abstractRoute2.default);

exports.default = AbstractEpilogueRoute;