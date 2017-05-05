import _ from 'lodash';

class IM {
	constructor(){
		this.instances = {
			_instances: []
		};
	}
	add(instance) {
		var name = instance.getClassName();
		if(name && name.indexOf("_") === 0) {
			throw new Error("Your getClassName cannot start with _");
		}
		if(name) {
			this.instances[name] = instance;
		}
		
		this.instances._instances.push(instance);
		
	}
	setupInstances(basePath, config) {
		_.each(this.instances._instances, function(instance){
			instance.setConfig(config);
			instance.setBasePath(basePath);
			instance.setup();
			instance.afterSetup();
		}, this);
		
		var manualInstanceNames = ['app', 'server']
		_.each(this.instances._instances, function(instance){
			if(!instance.getClassName() || manualInstanceNames.indexOf(instance.getClassName()) === -1) {
				instance.run();
			}
		}, this);
		
		_.each(manualInstanceNames, (name)=>{
			this.instances[name].run();
		}, this);
	
	}
	
}

export default new IM();