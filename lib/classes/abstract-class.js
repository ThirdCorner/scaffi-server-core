'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _instanceManager = require('../modules/instance-manager');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractClass = function () {
	function AbstractClass() {
		_classCallCheck(this, AbstractClass);

		_instanceManager.InstanceManager.add(this);
		this.params = {};
	}

	_createClass(AbstractClass, [{
		key: 'get',
		value: function get() {
			return this._instance || null;
		}
	}, {
		key: 'set',
		value: function set(instance) {
			this._instance = instance;
		}
	}, {
		key: 'getParam',
		value: function getParam(propName) {
			return _lodash2.default.get(this._config.params, propName, null);
		}
	}, {
		key: 'getConfig',
		value: function getConfig(propName) {
			return _lodash2.default.get(this._config.config, propName, null);
		}
	}, {
		key: 'setConfig',
		value: function setConfig(config) {
			this._config = config;
		}
	}, {
		key: 'getClassName',
		value: function getClassName() {
			return null;
		}
	}, {
		key: 'config',
		value: function config() {}
	}, {
		key: 'setup',
		value: function setup() {}
	}, {
		key: 'afterSetup',
		value: function afterSetup() {}
	}]);

	return AbstractClass;
}();

exports.default = AbstractClass;