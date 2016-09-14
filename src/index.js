'use strict';

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import ComponentLoader from './core-components';

import appRoot from 'app-root-path';
var ScaffiConfig = require(path.join(appRoot.toString(), "scaffi-server.json"));

const ENV_MODES = ["production", "development", "qa", "localhost", "prototype", "cli"];

class CoreLoader {
	constructor(args) {

		/*
			Get base path
		 */

		var overloadConfig = args || {};
		
		if(!_.isObject(ScaffiConfig)) {
			throw new Error("scaffi-server.json is not in the proper format. Is it in the basepath of your server app?");
		}

		this.basePath = appRoot.toString();
		this.config = {};
		this.loadConfig(overloadConfig);
		this.loadComponents();

	}
	loadConfig(overloadConfig){

		if(!ScaffiConfig.components) {
			throw new Error("Your scaffi-server.json file is not in the proper format. Needs a components property.");
		}

		var required = {
			app: {

			},
			server: {

			},
			router: {

			}

		};
		_.each(required, (obj, name)=>{
			if(!_.has(ScaffiConfig.components, name)) {
				ScaffiConfig.components[name] = obj;   
			}
		});

		var config = ScaffiConfig;

		var privateConfig;
		try{
			privateConfig = require(path.join(appRoot.toString(), "scaffi-server.private.json"));
		}catch(e){}

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

		this.combineConfigs(config, overloadConfig, "config");
		this.combineConfigs(config, overloadConfig, "components");
		this.combineConfigs(config, overloadConfig, "services");

		if(privateConfig){
			this.combineConfigs(config, privateConfig, "config");
			this.combineConfigs(config, privateConfig, "components");
			this.combineConfigs(config, privateConfig, "services");
		}

		this.config = config;

		if(!this.config.config.environment){
			throw new Error("config.environment is not provided. Scaffi doesn't know to do prototype or not.");
		}

		if(ENV_MODES.indexOf(this.config.config.environment) === -1) {
			throw new Error("Invalid environment supplied: " + this.config.config.environment + ". Expect one of the following: " + ENV_MODES.join(", ") );
		}

	}
	combineConfigs(config, privateConfig, propName) {

		if(privateConfig[propName]){
			if(!_.has(config, propName)) {
				config[propName] = {};
			}
			_.each(privateConfig[propName], (item, componentName) =>{
				if(item && !_.isObject(item)){
					config[propName][componentName] = item;
				}
				else if(item && _.isObject(item)) {
					_.each(item, (propValue, innerPropName)=>{
						if(!_.has(config[propName],  componentName)){
							config[propName][componentName] = {};
						}

						config[propName][componentName][innerPropName] = propValue;
					});
				}
			})
		}
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
		var components = new ComponentLoader({
			baseDir: this.basePath,
			config: this.config
		});
		
		console.log("========= RUNNING MODE: " + this.getEnvironment() + " =========");
	}
}
var coreLoader;
var returns = {
	initialize(args){
		coreLoader = new CoreLoader(args);
	},
	config: {
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
		isCliMode(){
			return coreLoader.getEnvironment() === "cli";
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
	Extends: {},
	Services: {}
};

/*
	Add extendables to obj
 */
fs
	.readdirSync(path.join(__dirname, "extendables"))
	.forEach((file)=>{

		var extendClass = require(path.join(__dirname, "extendables", file)).default;
		file = file.substr(0, file.indexOf(".js"));

		var split = file.split("-");
		var filename = "";
		_.each(split, bit=>{
			filename += _.capitalize(bit)
		});

		returns.Extends[filename] = extendClass;
	});

/*
	Add services to obj
 */

fs
	.readdirSync(path.join(__dirname, "services"))
	.forEach((file)=>{

		var extendClass = require(path.join(__dirname, "services", file, file));


		var split = file.split("-");
		var filename = "";
		_.each(split, bit=>{
			filename += _.capitalize(bit)
		});

		// console.log(filename);

		returns.Services[filename] = extendClass;
	});


module.exports = returns;