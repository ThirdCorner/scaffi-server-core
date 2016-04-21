'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoreLoader = function () {
	function CoreLoader(args) {
		_classCallCheck(this, CoreLoader);

		if (!args.config) {
			throw new Error("You must pass in the location of the scaffi-server.json when you initialize the core");
		}

		this.basePath = _path2.default.dirname(args.config);
		this.configPath = args.config;
		this.config = {};

		this.loadConfig();

		this.loadComponents();
	}

	_createClass(CoreLoader, [{
		key: 'loadConfig',
		value: function loadConfig() {
			var _this = this;

			try {
				var config = require(this.configPath);
			} catch (e) {
				console.log("Can't load scaffi-server.json config provided. Check the filepath in 'Error:'");
				throw e;
			}

			if (!config.components) {
				throw new Error("Your scaffi-server.json file is not in the proper format. Needs a components property.");
			}

			var required = {
				app: {
					port: 3000
				},
				server: {},
				router: {}

			};
			_lodash2.default.each(required, function (obj, name) {
				if (!_lodash2.default.has(config.components, name)) {
					config.components[name] = obj;
				}
			});

			var componentsDir;
			try {
				componentsDir = _fs2.default.statSync(_path2.default.join(this.basePath, "config"));
			} catch (e) {}

			var that = this;
			if (componentsDir) {
				_fs2.default.readdirSync(_path2.default.join(this.basePath, "config")).filter(function (file) {
					return file.indexOf(".json") !== -1;
				}).forEach(function (file) {
					var json = require(_path2.default.join(that.basePath, "config", file));
					file = file.substr(0, file.indexOf(".json"));

					config.components[file] = config.components[file] || {};
					_lodash2.default.each(json, function (value, key) {
						config.components[file][key] = value;
					}, _this);
				});
			}

			this.config = config;
		}
	}, {
		key: 'loadComponents',
		value: function loadComponents() {
			var components = new _components2.default({
				baseDir: this.basePath,
				config: this.config
			});
		}
	}]);

	return CoreLoader;
}();

var returns = {
	initialize: function initialize(args) {
		return new CoreLoader(args);
	},

	Extends: {},
	Services: {}
};

/*
	Add extendables to obj
 */
_fs2.default.readdirSync(_path2.default.join(__dirname, "extendables")).forEach(function (file) {

	var extendClass = require(_path2.default.join(__dirname, "extendables", file)).default;
	file = file.substr(0, file.indexOf(".js"));

	var split = file.split("-");
	var filename = "";
	_lodash2.default.each(split, function (bit) {
		filename += _lodash2.default.capitalize(bit);
	});

	returns.Extends[filename] = extendClass;
});

/*
	Add services to obj
 */

_fs2.default.readdirSync(_path2.default.join(__dirname, "services")).forEach(function (file) {

	var extendClass = require(_path2.default.join(__dirname, "services", file));

	var split = file.split("-");
	var filename = "";
	_lodash2.default.each(split, function (bit) {
		filename += _lodash2.default.capitalize(bit);
	});

	console.log(filename);

	returns.Services[filename] = extendClass;
});

module.exports = returns;