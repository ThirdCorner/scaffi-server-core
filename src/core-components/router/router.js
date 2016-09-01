'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import path from 'path';
import appRoot from 'app-root-path';
var express = require('express');

class Router extends AbstractComponent {
	setup(app){
		var RouterInterface = {
			use(url, route) {
				app.use(url, route);
			},
			get(url, fn) {
				app.get(url + "/:id", (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});
			},
			post(url, fn) {
				app.post(url, (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});
			},
			put(url, fn) {
				app.put(url + "/:id", (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});

			},
			delete(url, fn) {
				app.delete(url + "/:id", (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});
			},
			deleteList(url, fn) {
				app.delete(url, (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});
			},
			list(url, fn) {
				app.get(url, (req, res, next)=>{
					try {
						fn(req, res, next);
					} catch (e) {
						res.sendError(e);
					}
				});

			}
			
		};
		
		this.set(RouterInterface);		
	}
	run(app){
		try {
			require(path.join(this.getBasePath(), 'routes'))(app, this.get());

		}catch(e){}

		var router = express.Router();

		/* GET home page. */
		router.get('/', function (req, res, next) {
			res.sendFile(path.join(appRoot.toString(), 'public', 'index.html'));
		});


		this.runFallbacks(app);

	}
	runFallbacks(app) {
		/*
			All unknown routes, just send the index?????
		 */
		app.all('*', function (req, res, next) {
			res.sendFile(path.join(appRoot.toString(), 'public', 'index.html'));
		});

		// catch 404 and forward to error handler
		app.use(function (req, res, next) {
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

		// error handlers

		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function (err, req, res, next) {
				res.status(err.status || 500);
				res.send({
					message: err.message,
					error: err
				});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		});
	}
}

export default Router;