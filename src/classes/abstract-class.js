import InstanceManager from '../modules/instance-manager';
import _ from 'lodash';

class AbstractClass {
	constructor() {
		InstanceManager.add(this);
		this.params = {};
	}
	
	get() {
		return this._instance || null;
	}
	
	set(instance) {
		this._instance = instance;
	}
	
	getParam(propName) {
		return _.get(this._config.params, propName, null);
	}
	
	getConfig(propName) {
		return _.get(this._config.config, propName, null);
	}
	
	getBasePath() {
		return this.basePath;
	}
	setBasePath(path) {
		this.basePath = path;
	}
	
	setConfig(config) {
		this._config = config;
	}
	
	getClassName() {
		return null;
	}
	
	config(){}
	
	setup() {
	}
	run() {
	}
	
	afterSetup() {
	}
}
	
	


export default AbstractClass;