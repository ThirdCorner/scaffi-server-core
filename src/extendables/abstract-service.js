'use strict';

class AbstractService {
	constructor(){
		this._initialized = false;
	}
	call(args){
		if(!args || !args.silent) {
			this._markUsage();
		}
	}
	requiredComponents(){
		throw new Error(`Your service must extend 'hasRequiredComponents' as a function`);
	}
	initialize(){}
	set(name, value){
		this[name] = value;
	}
	get(name) {
		return this[name] || null;
	}
	canUse(){
		if(!this.isInitialized()) {
			throw new Error("Trying to use service when it hasn't been initialized. If this is in a component, you can't call this until component setup has happen. Either call in render() or call inside a promise established in setup.");
		}
		if(!this.hasRequiredComponents() && this._isBeingUsed) {
			throw new Error("Trying to use service that doesn'")
		}
	}
	_isUsed(){
		return this._isBeingUsed;
	}
	_markUsage(){
		this._isBeingUsed = true;
	}
	isInitialized(){
		return this._initialized;
	}
	setInitialized(){
		this._initialized = true;
	}
}

export default AbstractService;