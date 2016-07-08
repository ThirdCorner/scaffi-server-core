'use strict';

import AbstractComponent from '../../extendables/abstract-component';

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import _ from 'lodash';

class App extends AbstractComponent{
	setup(){
		this.setupApp();
		this.setupAppPresets();
		this.attachSendHandlers()
	}
	setupApp(){
		this.set(express());
	}
	setupAppPresets(){
		
		var app = this.get();
		/*
			Tell frontend what's available for REST and hook into the OPTIONS resource
		 */
		app.use(function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

			// intercept OPTIONS method
			if ('OPTIONS' == req.method) {
				res.sendStatus(200);
			}
			else {
				next();
			}
		});
		
		var port = process.env.PORT || this.getParam("port");
		if(!port) {
			port = '3000'
		}

		port = this.normalizePort(port);
		/*
		 For Localhost
		 */
		app.set('views', path.join(this.getBasePath(), 'views'));
		app.set('view engine', 'jade');


		// uncomment after placing your favicon in /public
		//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
		//app.use(logger('dev'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(express.static(path.join(this.getBasePath(), "public")));

		app.set('port', port);
		
		
		
	}
	attachSendHandlers(){
		this.get().use((req, res, next)=>{
			res.sendSuccess = (data)=>{
				if(data && !_.isObject(data)) {
					data = {
						response: data
					}
				}
				
				res.send(data);
			};
			res.sendUnauthorized = (errorMsg, stack)=>{
				res.status(401).send({
					errorType: "unauthorized",
					message: message,
					stack
				})
			};
			res.sendError = (errorMsg, stack)=>{
				res.status(500).send({
					errorType: "error",
					message: error,
					stack
				});
			};
			res.sendNotFound = (errorMsg, stack)=>{
				res.status(404).send({
					errorType: "notFound",
					message: error,
					stack
				});
			};
			
			next();
		});
	}
	normalizePort(val) {
		var port = parseInt(val, 10);
		
		if (isNaN(port)) {
			// named pipe
			return val;
		}
		
		if (port >= 0) {
			// port number
			return port;
		}
		
		return false;
	}
	
}
export default App;