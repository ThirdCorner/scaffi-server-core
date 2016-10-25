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
		app.use((req, res, next) => {
			/*
				This is so cookies will work. We have to specify a specific address to get through CORS
			 */
			res.header('Access-Control-Allow-Credentials', true);
			
			/*
				4000 4001 are from Scaffi start, browsersync is set to use those two ports
			 */
			
			var origins = ["http://localhost:" + this.getConfig("uiLocalhostPort"),  "http://localhost:4000", "http://localhost:4001" ];
			res.header("Access-Control-Allow-Origin", origins);

			res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Pragma, Cache-Control");
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

			/*
				Add  query string parser; This will parse any query values for a json structure and convert to object.
			 */
			if(req.query) {
				_.each(req.query, (value, name)=>{
					try {
						req.query[name] = JSON.parse(value);
					} catch(e){

					}
				})
			}
			
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
			console.log("(reverting to serverLocalhostPort because no port was set)");
			port = this.getConfig("serverLocalhostPort");
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
			res.sendForbidden = (errorMsg, stack)=>{
				res.status(403).send({
					errorType: "forbidden",
					message: errorMsg,
					stack: stack
				})
			};
			res.sendUnauthorized = (errorMsg, stack)=>{
				res.status(401).send({
					errorType: "unauthorized",
					message: errorMsg,
					stack: stack
				})
			};
			res.sendError = (errorMsg, stack)=>{
				if(!stack && errorMsg && errorMsg instanceof Error) {
					stack = errorMsg.stack;
					errorMsg = errorMsg.message;
				}
				res.status(500).send({
					errorType: "error",
					message: errorMsg,
					stack: stack
				});
			};
			res.sendNotFound = (errorMsg, stack)=>{
				res.status(404).send({
					errorType: "not_found",
					message: errorMsg,
					stack: stack
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