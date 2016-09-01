import _ from 'lodash';

var ForbiddenError = require('epilogue').Errors.ForbiddenError;

module.exports = function(db, epilogue, io) {

	// Create REST resource
	var ParamResource = epilogue.resource({
		model: db.Test,
		endpoints: ['/api/test', '/api/test/:id']
	});


	// ModelExtensions(io, ParamResource, "Param");

	ParamResource.update.send.before((req, res, context)=> {
		
		var id = req.params.id;

		return context.continue;

	});
	ParamResource.create.send.before((req, res, context)=> {

		var id = context.instance.dataValues.id;

		return context.continue;

	});
	ParamResource.read.fetch.before((req, res, context)=>{
		context.include = [];
		_.forEach(arrayStructures, (name)=>{
			context.include.push({model: db[name]});
		});

		return context.continue;

	});
	ParamResource.list.fetch.before(function(req, res, context){

//		throw new ForbiddenError("thotoo");

		return context.continue;

	});
	return ParamResource;
};