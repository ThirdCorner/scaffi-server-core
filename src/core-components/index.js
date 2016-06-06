"use strict";

import fs from "fs";
import path from "path";
import _ from 'lodash';


class ComponentLoader {
	constructor(args){
		this.LoadManager = {
			_components: {},
			_loadOrder: []
		};

		this.baseDir = args.baseDir;
		this.componentsDir = __dirname;
		this.customComponents = path.join(this.baseDir, "components");
		if(!this.baseDir) {
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
	

	loadAppComponent(){
		this.loadComponentDependency('app');
		this.moveComponentToBase('app');
	}
	loadCoreComponents(){
		var that = this;
		this.getFiles(
			__dirname,
			(file)=>{
				if(file.indexOf(".") !== -1) {
					return false;
				}
				// We don't want to load app twice, and we're already loading it above
				if(file == 'app') {
					return false;
				}

				if(file == 'server') {
					return true;
				}

				//console.log("HAS FILE: " + file, _.has(that.config.components, file))
				return _.has(that.config.components, file)
			},
			(file)=>{
				that.loadComponentDependency(file);
				that.moveComponentToBase(file);			
			}
		);

	}
	loadExtendedComponents(){
		var that = this;
		if(!this.hasFiles(that.customComponents)) {
			console.log("No 'components' folder found at root so assuming no custom components needing to be loaded");
			return true;
		}
		try {
			console.log(that.customComponents);
			this.getFiles(
				that.customComponents,
				(file)=> file.indexOf(".") === -1,
				(file)=> {
					/*
					 We only want to load ones that are new. Extended components get loaded in the first read cycle
					 */
					console.log("CUSTOM: " + file);
					if (!_.has(that.LoadManager._components, file)) {
						that.loadComponentDependency(file, true);
						that.moveComponentToBase(file);
					}
				}
			)
		} catch(e){
			throw e;
		}
	}
	requiredSanityCheck(){
		_.each(this.LoadManager._components, (component, name)=>{
			var component = this.LoadManager._components[name]
			this.checkRequiresExistence(component, name);
		}, this);

	}
	lazySetupRemainingComponents(){
		var counter = 0;
		while(this.lazyLoadComponents()) {
			counter++;
			//console.log("Component cycle #" + counter);
			if(counter > 200) {
				throw new Error("Component loading has gone outta wack with more than 200 iterations. Something's wrong.");
			}
		}
	}


	/*
	 Workflow worker fns
	 */


	getServiceConfig(name){
		if(_.has(this.config.services, name)) {
			return this.config.services[name];
		}

		return {};
	}

	getComponentConfig(name){
		if(_.has(this.config.components, name)) {
			return this.config.components[name];
		}

		return {};
	}


	hasFiles(dirName){
		return fs.existsSync(dirName);
	}
	getFiles(dirName, filterFn, fileFn) {
		try {
			fs
				.readdirSync(dirName)
				.filter(filterFn)
				.forEach(fileFn);
		} catch(e){
			throw e
		};
	}
	getConfigFile(dir, name) {
		var config = {};
		try {
			config = require(path.join(dir, name, name + ".json"));
		} catch(e) {
			throw new Error(`Trying to load config for ${name} that doesn't have a ${name}.json file`);
		}

		
		return config;
	}

	loadComponentDependency(name, isCustomComponent) {

		var extended, dependencies = [];
		if(!isCustomComponent) {
			extended = require(path.join(this.componentsDir, name, name + ".js"));
			dependencies = this.getConfigFile(this.componentsDir, name).dependencies || [];

		}
		if(this.hasFiles(path.join(this.customComponents, name, name + ".js"))) {
			try {
				extended = require(path.join(this.customComponents, name, name + ".js"));
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

		if(!extended) {
			throw new Error(`Can't load the following custom component: ${name}`);
			return false;
		}
		
		this.LoadManager._components[name] = new extended.default(this.getComponentConfig(name), name);
		this.LoadManager._components[name].setBasePath(this.baseDir);
		this.LoadManager._components[name].setDependencies(dependencies);

		return extended;

	}
	moveComponentToBase(name){
		var component = this.LoadManager._components[name];
		var requiredComponents = [];
		requiredComponents = component.getDependencies();
		if(!_.isArray(requiredComponents)){
			throw new Error(`Component ${name} has a requiredComponents function declared but does not return an array`);
		}

		if(requiredComponents.length) {
			var needsDependency = false;
			_.each(requiredComponents, depName =>{
				if(!_.has(this.LoadManager, depName)) {
					needsDependency = true;
				}
			}, this);

			if(needsDependency) {
				return false;
			}
		}


		this.LoadManager[name] = component;
		this.LoadManager._loadOrder.push(name);

		this.callComponentFn(this.LoadManager[name], name, "setup");
		return true;

	}

	checkRequiresExistence(component, name){
		var requiredComponents =  component.getDependencies();
		_.each(requiredComponents, depName =>{
			if(!_.has(this.LoadManager._components, depName)) {
				throw new Error(`Component ${name} requiredComponents ${depName} which is not registered in the components folder. Either it's mispelled or doesn't exist.`);
			}
		}, this);

	}
	callComponentFn(component, name, fnCall) {
		
		var requiredComponents = component.getDependencies();

		var args = [];
		if(requiredComponents.length) {
			_.each(requiredComponents, (requireName)=>{
				if(!_.has(this.LoadManager, requireName)) {
					throw new Error(`Trying to setup component ${name} with required component ${requireName} that doesn't exist`);
				}

				args.push(this.LoadManager[requireName].get());
			}, this);
		}

		var returnObj = component[fnCall].apply(component, args);
		if(fnCall == "setup" && returnObj) {
			component.set(returnObj);
		}

	}
	lazyLoadComponents() {
		var notLoaded = [];
		_.each(this.LoadManager._components, (obj, key)=>{
			if(this.LoadManager._loadOrder.indexOf(key) === -1) {
				notLoaded.push(key);
			}
		}, this);

		if(notLoaded.length == 0) {
			return false;
		}

		var loaded = [];
		_.each(notLoaded, (name)=>{
			if(this.moveComponentToBase(name)){
				loaded.push(name);
			}
		});

		if(loaded.length == 0) {
			console.log(notLoaded);
			throw new Error("Unable to load components when there are still some. Check their 'requiredComponents' list for circular references");
		}

		return true;

	}
	loadServices(){
		var coreService = path.join(__dirname,'..', 'services');
		var loadedServices = [];
		loadedServices = loadedServices.concat(this.initializeServices(coreService));
		loadedServices = loadedServices.concat(this.initializeServices(path.join(this.baseDir, 'services')));
		return loadedServices;
	}
	initializeServices(serviceDir){
		var loadedServices = [];
		var that = this;
		this.getFiles(
			serviceDir,
			(file)=>{
				return file.indexOf(".") === -1 && file !== 'abstract-service' && _.has(that.config.services, file);
			},
			(file)=>{

				loadedServices.push(file);
				var service = require(path.join(serviceDir, file, file));
				if(service.default) {
					service = service.default;
				}
				service.setParams(that.getServiceConfig(file));
				
				/*
				 THis needs to fail if a service is using a component that's not loaded
				 Right now it's not throwing the error. Need to fix once config dictates what gets loaded
				 */
				try {
					that.checkRequiresExistence(service, file);
				} catch(e) {
					throw new Error(`You're trying to use ${file} that does not have the required components loaded. Required components: ${service.requiredComponents()}`);
				}
				
				that.callComponentFn(service, file, 'initialize');
				
			}
		);
		return loadedServices;
	}
	runComponents(){
		_.each(this.LoadManager._loadOrder, (name)=>{
			this.callComponentFn(this.LoadManager[name], name, "run");
		}, this);

	}
}

export default ComponentLoader;



