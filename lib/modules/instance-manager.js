"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IM = function () {
	function IM() {
		_classCallCheck(this, IM);

		this.instances = {
			_instances: []
		};
	}

	_createClass(IM, [{
		key: "add",
		value: function add(instance) {
			var name = instance.getClassName();
			if (name && name.indexOf("_") === 0) {
				throw new Error("Your getClassName cannot start with _");
			}
			if (name) {
				this.instances[name] = instance;
			}

			this.instances._instances.push(instance);
		}
	}, {
		key: "setupInstances",
		value: function setupInstances(basePath, config) {
			var _this = this;

			_lodash2.default.each(this.instances._instances, function (instance) {
				instance.setConfig(config);
				instance.setBasePath(basePath);
				instance.setup();
				instance.afterSetup();
			}, this);

			var manualInstanceNames = ['app', 'server'];
			_lodash2.default.each(this.instances._instances, function (instance) {
				if (!instance.getClassName() || manualInstanceNames.indexOf(instance.getClassName()) === -1) {
					instance.run();
				}
			}, this);

			_lodash2.default.each(manualInstanceNames, function (name) {
				_this.instances[name].run();
			}, this);
		}
	}]);

	return IM;
}();

exports.default = new IM();