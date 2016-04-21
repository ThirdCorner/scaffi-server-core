'use strict';

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import ComponentLoader from './components';

class CoreLoader {
	constructor(args) {
		if(!args.config) {
			throw new Error("You must pass in the location of the scaffi-server.json when you initialize the core");
		}


		this.basePath = path.dirname(args.config);
		this.configPath = args.config;
		this.config = {};

		this.loadConfig();

		this.loadComponents();

	}
	loadConfig(){

		try {
			var config = require(this.configPath);
		} catch(e){
			console.log("Can't load scaffi-server.json config provided. Check the filepath in 'Error:'");
			throw e;
		}


		if(!config.components) {
			throw new Error("Your scaffi-server.json file is not in the proper format. Needs a components property.");
		}

		var required = {
			app: {
				port: 3000
			},
			server: {

			},
			router: {

			}

		};
		_.each(required, (obj, name)=>{
			if(!_.has(config.components, name)) {
				config.components[name] = obj;
			}
		});

		var componentsDir;
		try{
			componentsDir = fs.statSync(path.join(this.basePath, "config"));
		}catch(e){}


		var that = this;
		if(componentsDir) {
			fs
				.readdirSync(path.join(this.basePath, "config"))
				.filter((file)=> {return file.indexOf(".json") !== -1})
				.forEach((file)=>{
					var json = require(path.join(that.basePath, "config", file));
					file = file.substr(0, file.indexOf(".json"));

					config.components[file] = config.components[file] || {};
					_.each(json, (value, key)=>{
						config.components[file][key] = value;
					}, this);
				});
		}

		this.config = config;

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

		var extendClass = require(path.join(__dirname, "services", file));


		var split = file.split("-");
		var filename = "";
		_.each(split, bit=>{
			filename += _.capitalize(bit)
		});

		console.log(filename);

		returns.Services[filename] = extendClass;
	});


module.exports = returns;