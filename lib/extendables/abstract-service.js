"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractService = function () {
	function AbstractService() {
		_classCallCheck(this, AbstractService);

		this._initialized = false;
	}
	// call(args){
	// 	if(!args || !args.silent) {
	// 		this._markUsage();
	// 	}
	// }


	_createClass(AbstractService, [{
		key: "getDependencies",
		value: function getDependencies() {
			return this.dependencies || [];
		}
	}, {
		key: "setDependencies",
		value: function setDependencies(dependencies) {
			this.dependencies = dependencies;
		}
	}, {
		key: "setParams",
		value: function setParams(args) {
			var _this = this;

			this.params = {};
			_lodash2.default.each(args, function (value, key) {
				_this.params[key] = value;
			}, this);
		}
	}, {
		key: "hasParam",
		value: function hasParam(name) {
			return _lodash2.default.has(this.params, name);
		}
	}, {
		key: "getParam",
		value: function getParam(name) {
			if (!this.hasParam(name)) {
				return null;
			}

			return this.params[name];
		}
	}, {
		key: "initialize",
		value: function initialize() {}
	}, {
		key: "set",
		value: function set(name, value) {
			this[name] = value;
		}
	}, {
		key: "get",
		value: function get(name) {
			return this[name] || null;
		}
	}, {
		key: "canUse",
		value: function canUse() {
			if (!this.isInitialized()) {
				throw new Error("Trying to use service when it hasn't been initialized. If this is in a component, you can't call this until component setup has happen. Either call in render() or call inside a promise established in setup.");
			}
			if (!this.getDependencies() && this._isBeingUsed) {
				throw new Error("Trying to use service that doesn'");
			}
		}
	}, {
		key: "_isUsed",
		value: function _isUsed() {
			return this._isBeingUsed;
		}
	}, {
		key: "_markUsage",
		value: function _markUsage() {
			this._isBeingUsed = true;
		}
	}, {
		key: "isInitialized",
		value: function isInitialized() {
			return this._initialized;
		}
	}, {
		key: "setInitialized",
		value: function setInitialized() {
			this._initialized = true;
		}
	}]);

	return AbstractService;
}();

exports.default = AbstractService;