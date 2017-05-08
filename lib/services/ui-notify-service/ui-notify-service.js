'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractService = require('../../classes/abstract-service');

var _abstractService2 = _interopRequireDefault(_abstractService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UiNotifyService = function (_AbstractService) {
	_inherits(UiNotifyService, _AbstractService);

	function UiNotifyService() {
		_classCallCheck(this, UiNotifyService);

		return _possibleConstructorReturn(this, (UiNotifyService.__proto__ || Object.getPrototypeOf(UiNotifyService)).apply(this, arguments));
	}

	_createClass(UiNotifyService, [{
		key: 'setup',
		value: function setup(socket) {
			this.socket = socket;
		}
	}, {
		key: 'emitCreate',
		value: function emitCreate(resourceName, data) {
			if (this.socket) {
				this.socket.emit("create:" + resourceName, data);
			}
		}
	}, {
		key: 'emitDelete',
		value: function emitDelete(resourceName, id) {
			if (this.socket) {
				this.socket.emit("delete:" + resourceName, id);
			}
		}
	}, {
		key: 'emitUpdate',
		value: function emitUpdate(resourceName, id, data) {
			if (this.socket) {
				this.socket.emit("update:" + resourceName + "#" + id, data);
			}
		}
	}, {
		key: 'emitStateChange',
		value: function emitStateChange(resourceName, id, state, data) {
			if (this.socket) {
				if (typeof state != 'string') {
					throw new Error("You must pass a status string to transmit statuses");
				}
				console.log("NOTIFY STATE", state, id, resourceName);

				if (id == null) {
					this.socket.emit("state:" + resourceName, { state: state, data: data });
				} else {
					this.socket.emit("state:" + resourceName + "#" + id, { state: state, data: data });
				}
			}
		}
	}]);

	return UiNotifyService;
}(_abstractService2.default);

var Service = new UiNotifyService();
exports.default = Service;