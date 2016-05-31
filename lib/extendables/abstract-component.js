'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractComponent = function () {
	function AbstractComponent(args, componentName) {
		var _this = this;

		_classCallCheck(this, AbstractComponent);

		this.params = {};
		_lodash2.default.each(args, function (value, key) {
			_this.params[key] = value;
		}, this);

		this.componentName = componentName;

		if (typeof this.requiredParams === "function" && _lodash2.default.isArray(this.requiredParams())) {
			_lodash2.default.each(this.requiredParams(), function (paramName) {
				if (!_this.hasParam(paramName)) {
					throw new Error('Param \'' + paramName + '\' not provided in config.json for component \'' + componentName + '\'');
				}
			}, this);
		}
	}

	_createClass(AbstractComponent, [{
		key: 'getDependencies',
		value: function getDependencies() {
			return this.dependencies || [];
		}
	}, {
		key: 'setDependencies',
		value: function setDependencies(dependencies) {
			this.dependencies = dependencies;
		}
	}, {
		key: 'setBasePath',
		value: function setBasePath(basePath) {
			this.basePath = basePath;
		}
	}, {
		key: 'getBasePath',
		value: function getBasePath() {
			return this.basePath;
		}
	}, {
		key: 'hasParam',
		value: function hasParam(name) {
			return _lodash2.default.has(this.params, name);
		}
	}, {
		key: 'getParam',
		value: function getParam(name) {
			if (!this.hasParam(name)) {
				return null;
			}

			return this.params[name];
		}
	}, {
		key: 'loadFiles',
		value: function loadFiles(pathSrc, fileFn) {
			_fs2.default.readdirSync(pathSrc).filter(function (file) {
				return file.indexOf(".") !== 0 && file != 'index.js';
			}).forEach(function (file) {
				fileFn(require(_path2.default.join(pathSrc, file)), file);
			});
		}
	}, {
		key: 'has',
		value: function has() {
			return this.instance ? true : false;
		}
	}, {
		key: 'get',
		value: function get() {
			if (!this.instance) {
				throw new Error("GETTER instance not initialized for component");
			}
			return this.instance;
		}
	}, {
		key: 'set',
		value: function set(instance) {
			this.instance = instance;
		}

		/*
  	Extend
   */

	}, {
		key: 'setup',
		value: function setup() {}
	}, {
		key: 'run',
		value: function run() {}
	}]);

	return AbstractComponent;
}();

exports.default = AbstractComponent;