'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _abstractClass = require('./abstract-class');

var _abstractClass2 = _interopRequireDefault(_abstractClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractService = function (_AbstractClass) {
	_inherits(AbstractService, _AbstractClass);

	function AbstractService() {
		_classCallCheck(this, AbstractService);

		return _possibleConstructorReturn(this, (AbstractService.__proto__ || Object.getPrototypeOf(AbstractService)).apply(this, arguments));
	}

	return AbstractService;
}(_abstractClass2.default);

exports.default = AbstractService;