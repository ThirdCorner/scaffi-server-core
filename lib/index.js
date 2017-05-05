'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AbstractModel = exports.AbstractService = exports.AbstractEpilogueRoute = exports.AbstractRoute = exports.AbstractComponent = exports.epilogue = exports.sequelize = exports.server = exports.app = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/*
	Core Components
 */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var _instanceManager = require('./modules/instance-manager');

var _instanceManager2 = _interopRequireDefault(_instanceManager);

var _app = require('./core-components/app/app');

var _app2 = _interopRequireDefault(_app);

var _server = require('./core-components/server/server');

var _server2 = _interopRequireDefault(_server);

var _sequelize = require('./core-components/sequelize/sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _epilogue = require('./core-components/epilogue/epilogue');

var _epilogue2 = _interopRequireDefault(_epilogue);

var _abstractComponent = require('./classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _abstractRoute = require('./classes/abstract-route');

var _abstractRoute2 = _interopRequireDefault(_abstractRoute);

var _abstractEpilogueRoute = require('./classes/abstract-epilogue-route');

var _abstractEpilogueRoute2 = _interopRequireDefault(_abstractEpilogueRoute);

var _abstractService = require('./classes/abstract-service');

var _abstractService2 = _interopRequireDefault(_abstractService);

var _abstractModel = require('./classes/abstract-model');

var _abstractModel2 = _interopRequireDefault(_abstractModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ENV_MODES = ["production", "development", "qa", "localhost", "prototype", "ci"];

var CoreLoader = function () {
	function CoreLoader(args) {
		_classCallCheck(this, CoreLoader);

		/*
  	Get base path
   */

		var config = args || {};

		if (!_lodash2.default.has(config, "config")) {
			throw new Error("Server needs an object passed to it with a config properyt.");
		}

		this.basePath = _appRootPath2.default.toString();
		this.config = {};
		this.loadConfig(config);
		this.loadComponents();
	}

	_createClass(CoreLoader, [{
		key: 'loadConfig',
		value: function loadConfig(config) {

			var mainProps = ["config", "private", "override"];
			_lodash2.default.each(mainProps, function (name) {
				if (!_lodash2.default.has(config, name)) {
					config[name] = {};
				}

				if (!_lodash2.default.has(config[name], "params")) {
					config[name].params = {};
				}

				if (!_lodash2.default.has(config[name], "config")) {
					config[name].params = {};
				}
			});

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

			this.config = _lodash2.default.merge(config.config, config.private, config.override);

			console.log("CONFIG", this.config);

			if (!this.config.config.environment) {
				throw new Error("config.environment is not provided. Scaffi doesn't know to do prototype or not.");
			}

			if (ENV_MODES.indexOf(this.config.config.environment) === -1) {
				throw new Error("Invalid environment supplied: " + this.config.config.environment + ". Expect one of the following: " + ENV_MODES.join(", "));
			}
		}
	}, {
		key: 'getVersion',
		value: function getVersion() {
			return this.config.config.version || "???";
		}
	}, {
		key: 'getEnvironment',
		value: function getEnvironment() {
			return this.config.config.environment;
		}
	}, {
		key: 'getConfigProperty',
		value: function getConfigProperty(name) {
			if (_lodash2.default.has(this.config.config, name)) {
				return this.config.config[name];
			}

			return null;
		}
	}, {
		key: 'loadComponents',
		value: function loadComponents() {

			_instanceManager2.default.setupInstances(this.basePath, this.config);

			console.log("========= RUNNING MODE: " + this.getEnvironment() + " =========");
			console.log("````````` VERSION: " + this.getVersion() + "`````````");
		}
	}]);

	return CoreLoader;
}();

var coreLoader;
var returns = {
	initialize: function initialize(args) {
		coreLoader = new CoreLoader(args);
	},

	config: {
		getVersion: function getVersion() {
			return coreLoader.getVersion();
		},
		isProductionMode: function isProductionMode() {
			return coreLoader.getEnvironment() === "production";
		},
		isDevelopmentMode: function isDevelopmentMode() {
			return coreLoader.getEnvironment() === "development";
		},
		isQaMode: function isQaMode() {
			return coreLoader.getEnvironment() === "qa";
		},
		isLocalhostMode: function isLocalhostMode() {
			return coreLoader.getEnvironment() === "localhost";
		},
		isPrototypeMode: function isPrototypeMode() {
			return coreLoader.getEnvironment() === "prototype";
		},
		isCiMode: function isCiMode() {
			return coreLoader.getEnvironment() === "ci";
		},
		getEnvironment: function getEnvironment() {
			return coreLoader.getEnvironment();
		},
		get: function get() {
			if (coreLoader.getEnvironment() === "localhost" || coreLoader.getEnvironment() === "prototype" || coreLoader.getEnvironment() === "development") {
				return coreLoader.config;
			} else {
				throw new Error("Can't access config in non-development mode servers.");
			}
		}
	}

};

//import UiNotifyService from './services/ui-notify-service/ui-notify-service';

exports.default = returns;
exports.app = _app2.default;
exports.server = _server2.default;
exports.sequelize = _sequelize2.default;
exports.epilogue = _epilogue2.default;
exports.AbstractComponent = _abstractComponent2.default;
exports.AbstractRoute = _abstractRoute2.default;
exports.AbstractEpilogueRoute = _abstractEpilogueRoute2.default;
exports.AbstractService = _abstractService2.default;
exports.AbstractModel = _abstractModel2.default;