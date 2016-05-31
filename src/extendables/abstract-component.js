

import fs from 'fs';
import path from 'path';
import _ from 'lodash';

class AbstractComponent {
	constructor(args, componentName) {
		this.params = {};
		_.each(args, (value, key)=>{
			this.params[key] = value;
		}, this);
		
		this.componentName = componentName;


		if(typeof this.requiredParams === "function" && _.isArray(this.requiredParams())){
			_.each(this.requiredParams(), (paramName)=>{
				if(!this.hasParam(paramName)) {
					throw new Error(`Param '${paramName}' not provided in config.json for component '${componentName}'`);
				}
			}, this);
		}
	}
	getDependencies(){
		return this.dependencies || [];
	}
	setDependencies(dependencies) {
		this.dependencies = dependencies;
	}
	setBasePath(basePath){
		this.basePath = basePath;
	}
	getBasePath(){
		return this.basePath;
	}
	hasParam(name) {
		return _.has(this.params, name);
	}
	getParam(name) {
		if(!this.hasParam(name)) {
			return null;
		}

		return this.params[name];
	}
	loadFiles(pathSrc, fileFn ) {
		fs
			.readdirSync(pathSrc)
			.filter(function(file) {
				return (file.indexOf(".") !== 0) && (file != 'index.js');
			})
			.forEach(function(file) {
				fileFn( require(path.join(pathSrc, file)), file );
			});
	}
	has(){
		return this.instance ? true : false;
	}
	get(){
		if(!this.instance) {
			throw new Error("GETTER instance not initialized for component");
		}
		return this.instance;
	}
	set(instance) {
		this.instance = instance;
	}

	/*
		Extend
	 */

	setup(){}
	run(){}

}

export default AbstractComponent;