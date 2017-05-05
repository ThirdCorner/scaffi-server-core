import _ from 'lodash';

var ForbiddenError = require('epilogue').Errors.ForbiddenError;

import AbstractEpilogueRoute from '../../src/classes/abstract-epilogue-route';
import epilogue from '../../src/core-components/epilogue/epilogue';
import sequelize from '../../src/core-components/sequelize/sequelize';

class Test extends AbstractEpilogueRoute {
	setup(){
		var resource = epilogue.get().resource({
			model: sequelize.get().Test,
			endpoints: ['/api/test', '/api/test/:id']
		});
		
		/*
			So that we can attach other things to it.
		 */
		this.set(resource);
		
		resource.update.send.before((req, res, context)=> {
			
			var id = req.params.id;
			
			return context.continue;
			
		});
		resource.create.send.before((req, res, context)=> {
			
			var id = context.instance.dataValues.id;
			
			return context.continue;
			
		});
		resource.read.fetch.before((req, res, context)=>{
			context.include = [];
			// _.forEach(arrayStructures, (name)=>{
			// 	context.include.push({model: sequelize.get()[name]});
			// });
			
			return context.continue;
			
		});
		resource.list.fetch.before(function(req, res, context){

//		throw new ForbiddenError("thotoo");
			
			return context.continue;
			
		});
		
	}
}

export default new Test();