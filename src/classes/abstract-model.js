import AbstractClass from './abstract-class';
import sequelize from '../core-components/sequelize/sequelize';

import DataTypes from 'sequelize';

class AbstractModel extends AbstractClass {
	
	getDataTypes(){
		return DataTypes;
	}
	
	getModelStructure(){
		return null;
	}
	getModelOptions(){
		return null;
	}
	
	afterSetup(){
		
		if(!this.getModelStructure()){
			throw new Error("You must return a sequelize model object in getModelStructure()");
		}
		if(!this.getModelOptions()){
			throw new Error("You must return the sequelize model option object in getModelOptions()");
		}
		
		var opts = this.getModelOptions();
		var name = opts.name.singular;
		var model = sequelize.get().define(opts.name.singular, this.getModelStructure(), opts);
		//var model = sequelize.get().import(define);
		
		sequelize.get()[name] = model;
		sequelize.get()._modelParams[name] = {structure: this.getModelStructure(), options: opts};
		
	}
}

export default AbstractModel;