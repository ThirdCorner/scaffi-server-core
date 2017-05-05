'use strict';

import _ from 'lodash';
import appRoot from 'app-root-path';

import InstanceManager from './modules/instance-manager';

/*
	Core Components
 */
import app from './core-components/app/app';
import server from './core-components/server/server';
import sequelize from './core-components/sequelize/sequelize';
import epilogue from './core-components/epilogue/epilogue';

const ENV_MODES = ["production", "development", "qa", "localhost", "prototype", "ci"];

class CoreLoader {
	constructor(args) {

		/*
			Get base path
		 */

		var config = args || {};
		
		if(!_.has(config, "config")) {
			throw new Error("Server needs an object passed to it with a config properyt.");
		}
		
		
		this.basePath = appRoot.toString();
		this.config = {};
		this.loadConfig(config);
		this.loadComponents();

	}
	loadConfig(config){
	
		var mainProps = ["config", "private", "override"];
		_.each(mainProps, function(name){
			if(!_.has(config, name)) {
				config[name] = {};
			}
			
			if(!_.has(config[name], "params")) {
				config[name].params = {};
			}
			
			if(!_.has(config[name], "config")) {
				config[name].config = {};
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
		
		this.config = _.merge({}, config.config, config.private, config.override);

		console.log("CONFIG", this.config);
		
		if(!this.config.config.environment){
			throw new Error("config.environment is not provided. Scaffi doesn't know to do prototype or not.");
		}

		if(ENV_MODES.indexOf(this.config.config.environment) === -1) {
			throw new Error("Invalid environment supplied: " + this.config.config.environment + ". Expect one of the following: " + ENV_MODES.join(", ") );
		}

	}
	getVersion(){
		return this.config.config.version || "???";
	}
	getEnvironment() {
		return this.config.config.environment;
	}
	getConfigProperty(name) {
		if(_.has(this.config.config, name)){
			return this.config.config[name];
		}

		return null;
	}
	loadComponents(){
		
		InstanceManager.setupInstances(this.basePath, this.config);
		
		console.log("========= RUNNING MODE: " + this.getEnvironment() + " =========");
		console.log("````````` VERSION: " + this.getVersion() + "`````````");
	}
}
var coreLoader;
var returns = {
	initialize(args){
		coreLoader = new CoreLoader(args);
	},
	config: {
		getVersion(){
			return coreLoader.getVersion();
		},
		isProductionMode(){
			return coreLoader.getEnvironment() === "production";
		},
		isDevelopmentMode(){
			return coreLoader.getEnvironment() === "development";
		},
		isQaMode(){
			return coreLoader.getEnvironment() === "qa";
		},
		isLocalhostMode(){
			return coreLoader.getEnvironment() === "localhost";
		},
		isPrototypeMode(){
			return coreLoader.getEnvironment() === "prototype";
		},
		isCiMode(){
			return coreLoader.getEnvironment() === "ci";
		},
		getEnvironment(){
			return coreLoader.getEnvironment();
		},
		get(){
			if(coreLoader.getEnvironment() === "localhost" || coreLoader.getEnvironment() === "prototype" || coreLoader.getEnvironment() === "development") {
				return coreLoader.config;
			} else {
				throw new Error("Can't access config in non-development mode servers.");
			}
		}

	},

};

import AbstractComponent from './classes/abstract-component';
import AbstractRoute from './classes/abstract-route';
import AbstractEpilogueRoute from './classes/abstract-epilogue-route';
import AbstractService from './classes/abstract-service';
import AbstractModel from './classes/abstract-model';

//import UiNotifyService from './services/ui-notify-service/ui-notify-service';

export default returns;
export {
	app, server, sequelize, epilogue,
	AbstractComponent, AbstractRoute, AbstractEpilogueRoute, AbstractService, AbstractModel
}