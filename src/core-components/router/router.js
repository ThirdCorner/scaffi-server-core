'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import path from 'path';
var express = require('express');


class Router extends AbstractComponent {
	setup(app){
		var RouterInterface = {
			use(url, route) {
				app.use(url, route);
			},
			get(url, fn) {
				app.get(url + "/:id", fn);
			},
			post(url, fn) {
				app.post(url, fn);
			},
			put(url, fn) {
				app.put(url + "/:id", fn);

			},
			delete(url, fn) {
				app.delete(url + "/:id", fn);
			},
			deleteList(url, fn) {
				app.delete(url, fn);	
			},
			list(url, fn) {
				app.get(url, fn);
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
			res.sendFile(path.join(__dirname, '../public/index.html'));
		});



	}
	runFallbacks(app) {
		/*
		 Redirects all misc requests back to index page
		 */
		app.all('*', function (req, res, next) {
			res.redirect("/");
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
				res.render('error', {
					message: err.message,
					error: err
				});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		});
	}
}

export default Router;