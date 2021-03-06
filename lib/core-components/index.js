"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentLoader = function () {
	function ComponentLoader(args) {
		_classCallCheck(this, ComponentLoader);

		this.LoadManager = {
			_components: {},
			_loadOrder: []
		};

		this.baseDir = args.baseDir;
		this.componentsDir = __dirname;
		this.customComponents = _path2.default.join(this.baseDir, "components");
		if (!this.baseDir) {
			throw new Error("You must provide a baseDir property for your project");
		}

		this.config = args.config;

		this.loadAppComponent();
		this.loadCoreComponents();
		this.loadExtendedComponents();
		this.requiredSanityCheck();
		this.lazySetupRemainingComponents();

		/*
  	Setup services
  			Need to load services with requiredComponents, then do sanity checks
   */
		var loadedServices = this.loadServices();
		this.runComponents();

		console.log("==============================");
		console.log("Component Dependencies are Loaded");
		console.log(this.LoadManager._loadOrder);
		console.log("------------------------------");
		console.log("Services Loaded");
		console.log(loadedServices);
		console.log("==============================");
	}

	_createClass(ComponentLoader, [{
		key: "loadAppComponent",
		value: function loadAppComponent() {
			this.loadComponentDependency('app');
			this.moveComponentToBase('app');
		}
	}, {
		key: "loadCoreComponents",
		value: function loadCoreComponents() {
			var that = this;
			this.getFiles(__dirname, function (file) {
				if (file.indexOf(".") !== -1) {
					return false;
				}
				// We don't want to load app twice, and we're already loading it above
				if (file == 'app') {
					return false;
				}

				if (file == 'server') {
					return true;
				}

				//console.log("HAS FILE: " + file, _.has(that.config.components, file))
				return _lodash2.default.has(that.config.components, file);
			}, function (file) {
				that.loadComponentDependency(file);
				that.moveComponentToBase(file);
			});
		}
	}, {
		key: "loadExtendedComponents",
		value: function loadExtendedComponents() {
			var that = this;
			if (!this.hasFiles(that.customComponents)) {
				console.log("No 'components' folder found at root so assuming no custom components needing to be loaded");
				return true;
			}
			try {
				console.log(that.customComponents);
				this.getFiles(that.customComponents, function (file) {
					return file.indexOf(".") === -1;
				}, function (file) {
					/*
      We only want to load ones that are new. Extended components get loaded in the first read cycle
      */
					if (!_lodash2.default.has(that.LoadManager._components, file)) {
						that.loadComponentDependency(file, true);
						that.moveComponentToBase(file);
					}
				});
			} catch (e) {
				throw e;
			}
		}
	}, {
		key: "requiredSanityCheck",
		value: function requiredSanityCheck() {
			var _this = this;

			_lodash2.default.each(this.LoadManager._components, function (component, name) {
				var component = _this.LoadManager._components[name];
				_this.checkRequiresExistence(component, name);
			}, this);
		}
	}, {
		key: "lazySetupRemainingComponents",
		value: function lazySetupRemainingComponents() {
			var counter = 0;
			while (this.lazyLoadComponents()) {
				counter++;
				//console.log("Component cycle #" + counter);
				if (counter > 200) {
					throw new Error("Component loading has gone outta wack with more than 200 iterations. Something's wrong.");
				}
			}
		}

		/*
   Workflow worker fns
   */

	}, {
		key: "getServiceConfig",
		value: function getServiceConfig(name) {
			if (_lodash2.default.has(this.config.services, name)) {
				return this.config.services[name];
			}

			return {};
		}
	}, {
		key: "getComponentConfig",
		value: function getComponentConfig(name) {
			if (_lodash2.default.has(this.config.components, name)) {
				return this.config.components[name];
			}

			return {};
		}
	}, {
		key: "hasFiles",
		value: function hasFiles(dirName) {
			return _fs2.default.existsSync(dirName);
		}
	}, {
		key: "getFiles",
		value: function getFiles(dirName, filterFn, fileFn) {
			/*
   	Make sure we don't error out if the dir doesn't exist
    */
			if (!this.hasFiles(dirName)) {
				return false;
			}

			try {
				_fs2.default.readdirSync(dirName).filter(filterFn).forEach(fileFn);
			} catch (e) {
				throw e;
			};
		}
	}, {
		key: "getConfigFile",
		value: function getConfigFile(dir, name) {
			var config = {};
			try {
				config = require(_path2.default.join(dir, name, name + ".json"));
			} catch (e) {

				console.log("Can't find path json: " + _path2.default.join(dir, name, name + ".json"));
				throw new Error("Trying to load config for " + name + " that doesn't have a " + name + ".json file or unreadable: \n" + e.message + " ");
			}

			return config;
		}
	}, {
		key: "loadComponentDependency",
		value: function loadComponentDependency(name, isCustomComponent) {

			var extended,
			    dependencies = [];
			if (!isCustomComponent) {
				extended = require(_path2.default.join(this.componentsDir, name, name + ".js"));
				dependencies = this.getConfigFile(this.componentsDir, name).dependencies || [];
			}
			if (this.hasFiles(_path2.default.join(this.customComponents, name, name + ".js"))) {
				try {
					extended = require(_path2.default.join(this.customComponents, name, name + ".js"));
					if (extended) {
						dependencies = this.getConfigFile(this.customComponents, name).dependencies || [];
					}
				} catch (e) {
					throw e;
				}
			}

			// console.log("=============");
			// console.log(name);
			// console.log(this.customComponents)
			// console.log(this.componentsDir);
			// console.log("-------------");

			if (!extended) {
				throw new Error("Can't load the following custom component: " + name);
				return false;
			}

			this.LoadManager._components[name] = new extended.default(this.getComponentConfig(name), name);
			this.LoadManager._components[name].setBasePath(this.baseDir);
			this.LoadManager._components[name].setConfig(this.config.config);
			this.LoadManager._components[name].setDependencies(dependencies);

			return extended;
		}
	}, {
		key: "moveComponentToBase",
		value: function moveComponentToBase(name) {
			var _this2 = this;

			var component = this.LoadManager._components[name];
			var requiredComponents = [];
			requiredComponents = component.getDependencies();
			if (!_lodash2.default.isArray(requiredComponents)) {
				throw new Error("Component " + name + " has a requiredComponents function declared but does not return an array");
			}

			if (requiredComponents.length) {
				var needsDependency = false;
				_lodash2.default.each(requiredComponents, function (depName) {
					if (!_lodash2.default.has(_this2.LoadManager, depName)) {
						needsDependency = true;
					}
				}, this);

				if (needsDependency) {
					return false;
				}
			}

			this.LoadManager[name] = component;
			this.LoadManager._loadOrder.push(name);

			this.callComponentFn(this.LoadManager[name], name, "setup");
			return true;
		}
	}, {
		key: "checkRequiresExistence",
		value: function checkRequiresExistence(component, name) {
			var _this3 = this;

			var requiredComponents = component.getDependencies();
			_lodash2.default.each(requiredComponents, function (depName) {
				if (!_lodash2.default.has(_this3.LoadManager._components, depName)) {
					throw new Error("Component " + name + " requiredComponents " + depName + " which is not registered in the components folder. Either it's mispelled or doesn't exist.");
				}
			}, this);
		}
	}, {
		key: "callComponentFn",
		value: function callComponentFn(component, name, fnCall) {
			var _this4 = this;

			var requiredComponents = component.getDependencies();

			var args = [];
			if (requiredComponents.length) {
				_lodash2.default.each(requiredComponents, function (requireName) {
					if (!_lodash2.default.has(_this4.LoadManager, requireName)) {
						throw new Error("Trying to setup component " + name + " with required component " + requireName + " that doesn't exist");
					}

					args.push(_this4.LoadManager[requireName].get());
				}, this);
			}

			var returnObj = component[fnCall].apply(component, args);
			if (fnCall == "setup" && returnObj) {
				component.set(returnObj);
			}
		}
	}, {
		key: "lazyLoadComponents",
		value: function lazyLoadComponents() {
			var _this5 = this;

			var notLoaded = [];
			_lodash2.default.each(this.LoadManager._components, function (obj, key) {
				if (_this5.LoadManager._loadOrder.indexOf(key) === -1) {
					notLoaded.push(key);
				}
			}, this);

			if (notLoaded.length == 0) {
				return false;
			}

			var loaded = [];
			_lodash2.default.each(notLoaded, function (name) {
				if (_this5.moveComponentToBase(name)) {
					loaded.push(name);
				}
			});

			if (loaded.length == 0) {
				console.log(notLoaded);
				throw new Error("Unable to load components when there are still some. Check their 'requiredComponents' list for circular references");
			}

			return true;
		}
	}, {
		key: "loadServices",
		value: function loadServices() {
			var coreService = _path2.default.join(__dirname, '..', 'services');
			var loadedServices = [];
			loadedServices = loadedServices.concat(this.initializeServices(coreService));
			loadedServices = loadedServices.concat(this.initializeServices(_path2.default.join(this.baseDir, 'services')));
			return loadedServices;
		}
	}, {
		key: "initializeServices",
		value: function initializeServices(serviceDir) {
			var _this6 = this;

			var loadedServices = [];
			var that = this;
			this.getFiles(serviceDir, function (file) {
				return file.indexOf(".") === -1 && file !== 'abstract-service' && _lodash2.default.has(that.config.services, file);
			}, function (file) {

				loadedServices.push(file);
				var service = require(_path2.default.join(serviceDir, file, file));
				if (service.default) {
					service = service.default;
				}

				var dependencies = [];
				if (service) {
					dependencies = _this6.getConfigFile(serviceDir, file).dependencies || [];
				}
				service.setParams(that.getServiceConfig(file));
				service.setDependencies(dependencies);
				/*
     THis needs to fail if a service is using a component that's not loaded
     Right now it's not throwing the error. Need to fix once config dictates what gets loaded
     */
				try {
					that.checkRequiresExistence(service, file);
				} catch (e) {
					throw new Error("You're trying to use " + file + " that does not have the required components loaded. Required components: " + service.getDependencies());
				}

				that.callComponentFn(service, file, 'initialize');
			});
			return loadedServices;
		}
	}, {
		key: "runComponents",
		value: function runComponents() {
			var _this7 = this;

			_lodash2.default.each(this.LoadManager._loadOrder, function (name) {
				_this7.callComponentFn(_this7.LoadManager[name], name, "run");
			}, this);
		}
	}]);

	return ComponentLoader;
}();

exports.default = ComponentLoader;