'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _coreComponents = require('./core-components');

var _coreComponents2 = _interopRequireDefault(_coreComponents);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScaffiConfig = require(_path2.default.join(_appRootPath2.default.toString(), "scaffi-server.json"));

var CoreLoader = function () {
	function CoreLoader(args) {
		_classCallCheck(this, CoreLoader);

		/*
  	Get base path
   */

		var overloadConfig = args || {};

		if (!_lodash2.default.isObject(ScaffiConfig)) {
			throw new Error("scaffi-server.json is not in the proper format. Is it in the basepath of your server app?");
		}

		this.basePath = _appRootPath2.default.toString();
		this.config = {};
		this.loadConfig(overloadConfig);
		this.loadComponents();
	}

	_createClass(CoreLoader, [{
		key: 'loadConfig',
		value: function loadConfig(overloadConfig) {

			if (!ScaffiConfig.components) {
				throw new Error("Your scaffi-server.json file is not in the proper format. Needs a components property.");
			}

			var required = {
				app: {},
				server: {},
				router: {}

			};
			_lodash2.default.each(required, function (obj, name) {
				if (!_lodash2.default.has(ScaffiConfig.components, name)) {
					ScaffiConfig.components[name] = obj;
				}
			});

			/*
   	This is what you set in yo scaffi:config
    */
			ScaffiConfig.components["app"].port = ScaffiConfig.config.serverLocalhostPort;

			var config = ScaffiConfig;

			var privateConfig;
			try {
				privateConfig = require(_path2.default.join(_appRootPath2.default.toString(), "scaffi-server.private.json"));
			} catch (e) {}

			/*
   	We do the overloadConfig first because this is stuff passed through the injection point from the app.
   	Then we look for at anything set in .private.json.
   			~The reasoning for this is thus~
   	NODE as a standalone server:
   		You're gonna be using .private in this instance so this load order doesn't matter
   			NODE through iis:
   		IIS has stuff like port and what not that you'll want to pass to the app, but you can't do that
   		in JSON because you can't say process.env.PORT in a json, so we'll do it here
   		 */

			this.combineConfigs(config, overloadConfig, "components");
			this.combineConfigs(config, overloadConfig, "services");

			if (privateConfig) {
				this.combineConfigs(config, privateConfig, "components");
				this.combineConfigs(config, privateConfig, "services");
			}

			this.config = config;
		}
	}, {
		key: 'combineConfigs',
		value: function combineConfigs(config, privateConfig, propName) {

			if (privateConfig[propName]) {
				if (!_lodash2.default.has(config, propName)) {
					config[propName] = {};
				}
				_lodash2.default.each(privateConfig[propName], function (item, componentName) {
					if (item && _lodash2.default.isObject(item)) {
						_lodash2.default.each(item, function (propValue, innerPropName) {
							if (!_lodash2.default.has(config[propName], componentName)) {
								config[propName][componentName] = {};
							}

							config[propName][componentName][innerPropName] = propValue;
						});
					}
				});
			}
		}
	}, {
		key: 'loadComponents',
		value: function loadComponents() {
			var components = new _coreComponents2.default({
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

	var extendClass = require(_path2.default.join(__dirname, "services", file, file));

	var split = file.split("-");
	var filename = "";
	_lodash2.default.each(split, function (bit) {
		filename += _lodash2.default.capitalize(bit);
	});

	// console.log(filename);

	returns.Services[filename] = extendClass;
});

module.exports = returns;