'use strict';

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import ComponentLoader from './core-components';

import appRoot from 'app-root-path';
var ScaffiConfig = require(path.join(appRoot.toString(), "scaffi-server.json"));

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

		/*
			This is what you set in yo scaffi:config
		 */
		ScaffiConfig.components["app"].port = ScaffiConfig.config.serverLocalhostPort;

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

		this.combineConfigs(config, overloadConfig, "components");
		this.combineConfigs(config, overloadConfig, "services");

		if(privateConfig){
			this.combineConfigs(config, privateConfig, "components");
			this.combineConfigs(config, privateConfig, "services");
		}

		this.config = config;

	}
	combineConfigs(config, privateConfig, propName) {

		if(privateConfig[propName]){
			if(!_.has(config, propName)) {
				config[propName] = {};
			}
			_.each(privateConfig[propName], (item, componentName) =>{
				if(item && _.isObject(item)) {
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
	loadComponents(){
		var components = new ComponentLoader({
			baseDir: this.basePath,
			config: this.config
		})
	}
}

var returns = {
	initialize(args){
		return new CoreLoader(args);
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