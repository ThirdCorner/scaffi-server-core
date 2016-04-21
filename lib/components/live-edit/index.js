'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LiveEdit = function (_AbstractComponent) {
	_inherits(LiveEdit, _AbstractComponent);

	function LiveEdit() {
		_classCallCheck(this, LiveEdit);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(LiveEdit).apply(this, arguments));
	}

	_createClass(LiveEdit, [{
		key: 'requiredComponents',
		value: function requiredComponents() {
			return ['socket-io'];
		}
	}, {
		key: 'setup',
		value: function setup(socketIO) {
			var instance = {
				broadcastPOST: function broadcastPOST(namespace, modelData) {
					socketIO.emit("POST:" + namespace, modelData);
				},
				broadcastPUT: function broadcastPUT(namespace, id, modelData) {
					socketIO.emit("PUT:" + namespace + "#" + id, modelData);
				},
				broadcastDELETE: function broadcastDELETE(namespace, id) {
					socketIO.emit("DELETE:" + namespace + "#" + id, true);
				}
			};

			this.set(instance);
		}
	}]);

	return LiveEdit;
}(_abstractComponent2.default);

exports.default = LiveEdit;