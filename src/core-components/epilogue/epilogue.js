'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import epilogue from 'epilogue';
import NotifyService from '../../services/notify-service';
import _ from 'lodash';
import path from 'path';

class Epilogue extends AbstractComponent {
	setup(app, db){
		
		epilogue.initialize({
			app: app,
			sequelize: db.connection
		});

		this.setupRoutes(app, db, epilogue);
		
		this.setupSocketRoutes(epilogue);
		
		this.set(epilogue);
	}
	setupRoutes(app, db, epilogue) {
		epilogue.routes = {}
		this.loadFiles(path.join(this.getBasePath(), 'routes','epilogue'),(loadedFile) => {
			var routeModel = loadedFile(db, epilogue);
			epilogue.routes[routeModel.model.name] = routeModel;
		}) ;
	}
	setupSocketRoutes(epilogue) {
		if(!epilogue.routes) {
			return true;
		}
		
		var notify = NotifyService();
		_.each(epilogue.routes, (route, namespace)=>{
			
			/*
				Stringify any non-scalars before they hit the DB
			 */
			route.create.write.before(function(req, res, context){
				_.forEach(req.body, (value, name)=>{
					if(_.isObject(value)) {
						req.body[name] = JSON.stringify(value);
					}
				});
				return context.continue;
			});
			route.update.write.before(function(req, res, context){
				_.forEach(req.body, (value, name)=>{
					if(_.isObject(value)) {
						req.body[name] = JSON.stringify(value);
					}
				});
				return context.continue;
			});
			
			route.update.send.before(function(req, res, context){
				notify.emitUpdate(namespace, context.attributes.id, context.attributes);
				return context.continue;
			});
			route.create.send.before(function(req, res, context){
				notify.emitCreate(namespace, context.attributes);
				return context.continue;
			});
			route.delete.send.before(function(req, res, context){
				notify.emitDelete(namespace, context.criteria.id, true);
				return context.continue;
			});
		}, this);
	}
}

export default Epilogue;

