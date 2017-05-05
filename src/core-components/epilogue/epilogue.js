'use strict';

import epilogue from 'epilogue';
import _ from 'lodash';
import path from 'path';

import app from '../app/app';
import sequelize from '../sequelize/sequelize';

import AbstractComponent from '../../classes/abstract-component';
//import UiNotifyService from '../../services/ui-notify-service/ui-notify-service';

class Epilogue extends AbstractComponent {
	getClassName(){
		return "epilogue";
	}
	setup(){
		var db = sequelize.get();
		epilogue.initialize({
			app: app.get(),
			sequelize: db
		});
		
		this.set(epilogue);
		
	}
	setupErrorRouteOverride(route){

		var milestones = ["create", "delete", "list", "read", "update"];
		_.each(milestones, (name)=>{
			route.controllers[name].error = (req, res, error)=> {
				if(error.cause) {
					console.log(error.cause);
				}
				
				console.log(error.stack);
				res.sendError(error.message, error.cause || error.stack);
			};

		});
	}
	// setupSocketRoute(route) {
	// 	var namespace = route.model.name;
	//
	// 	/*
	// 		Stringify any non-scalars before they hit the DB
	// 	 */
	// 	route.create.write.before(function(req, res, context){
	// 		_.forEach(req.body, (value, name)=>{
	// 			if(_.isObject(value)) {
	// 				req.body[name] = JSON.stringify(value);
	// 			}
	// 		});
	// 		return context.continue;
	// 	});
	// 	route.update.write.before(function(req, res, context){
	// 		_.forEach(req.body, (value, name)=>{
	// 			if(_.isObject(value)) {
	// 				req.body[name] = JSON.stringify(value);
	// 			}
	// 		});
	// 		return context.continue;
	// 	});
	//
	// 	route.update.send.before(function(req, res, context){
	// 		UiNotifyService.emitUpdate(namespace, context.attributes.id, context.attributes);
	// 		return context.continue;
	// 	});
	// 	route.create.send.before(function(req, res, context){
	// 		UiNotifyService.emitCreate(namespace, context.attributes);
	// 		return context.continue;
	// 	});
	// 	route.delete.send.before(function(req, res, context){
	// 		UiNotifyService.emitDelete(namespace, context.criteria.id, true);
	// 		return context.continue;
	// 	});
	// }
}

export default new Epilogue();

