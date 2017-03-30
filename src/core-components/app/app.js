'use strict';

import AbstractComponent from '../../extendables/abstract-component';


import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import _ from 'lodash';
import cors from 'cors';

var nodeIp = require("ip");

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
		
		var port = process.env.PORT || this.getParam("port");
		if(!port) {
			console.log("(reverting to serverLocalhostPort because no port was set)");
			port = this.getConfig("serverLocalhostPort");
		}
		
		port = this.normalizePort(port);
		
		var ports = ["4000", "4001", port.toString()];
		var whitelist = ["file://", "gap://ready"];
		_.each(ports, (p)=>{
			whitelist.push("http://localhost:" + p);
		});
		
		if(this.getParam("whitelist")) {
			var extraWhitelists = this.getParam("whitelist");
			if(_.isString(extraWhitelists)) {
				extraWhitelists = [extraWhitelists];
			}
			
			if(_.isArray(extraWhitelists)) {
				whitelist = whitelist.concat(extraWhitelists);
			}
		}
		
		if(this.getConfig("environment") == "localhost") {
			_.each(ports, (p)=>{
				whitelist.push("http://" + nodeIp.address() + ":" + p);
			});
			
		}
		
		
		var corsOptions = {
			origin: (origin, callback)=>{
				var originIsWhitelisted = true;
				/*
					Param could be null or true, so
				 */
				if(this.getParam("enable-cors") === true) {
					originIsWhitelisted = whitelist.indexOf(origin) !== -1;
				}
				
				var msg = 'Bad Request';
				if(this.getConfig("environment") != "production") {
					msg += "; CORS ISSUE; Origin is: " + origin;
				}
				callback(originIsWhitelisted || !origin ? null : msg, originIsWhitelisted);
			},
			allowedHeaders: ["Content-Range"],
			credentials: true,
			headers: ["Content-Range"] // Need this for epilogue list ranges to pass to browser
		};
		
		app.use(cors(corsOptions));

		/*
			Make sure that deep nested objects are turned into objects
		 */
		app.use((req, res, next)=>{
			if(req.query) {
				_.each(req.query, (value, name)=> {
					try {
						req.query[name] = JSON.parse(value);
					} catch (e) {
					}
				});
			}

			next();
		});
		/*
			Tell frontend what's available for REST and hook into the OPTIONS resource
		 */
		// app.use((req, res, next) => {
		// 	/*
		// 		This is so cookies will work. We have to specify a specific address to get through CORS
		// 	 */
		// 	res.header('Access-Control-Allow-Credentials', true);
		//
		//
		// 	/*
		// 		Had the following
		// 	 var origins = ["http://localhost:" + this.getConfig("uiLocalhostPort"),  "http://localhost:4000", "http://localhost:4001" ];
		// 	 res.header("Access-Control-Allow-Origin", origins);
		//
		// 	    Chrome wouldn't let it pass because of multilpe headers
		//
		// 	    If I set to just "http://localhost:" + this.getConfig("uiLocalhostPort", then I can't run multiple localhost browsersync sessions
		// 	    So setting to * for now, and I"ll have to try adding cookie stuff later to see if this will work.
		// 	 */
		//
		//
		// 	res.header("Access-Control-Allow-Origin", '*');
		//
		//
		//
		// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Pragma, Cache-Control");
		// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		//
		// 	/*
		// 		Add  query string parser; This will parse any query values for a json structure and convert to object.
		// 	 */
		// 	if(req.query) {
		// 		_.each(req.query, (value, name)=>{
		// 			try {
		// 				req.query[name] = JSON.parse(value);
		// 			} catch(e){
		//
		// 			}
		// 		})
		// 	}
		//
		// 	// intercept OPTIONS method
		// 	if ('OPTIONS' == req.method) {
		// 		res.sendStatus(200);
		// 	}
		// 	else {
		// 		next();
		// 	}
		// });
		
		
		/*
		 For Localhost
		 */
		app.set('views', path.join(this.getBasePath(), 'views'));
		app.set('view engine', 'jade');


		// uncomment after placing your favicon in /public
		//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
		//app.use(logger('dev'));
		app.use(bodyParser.json({limit: this.getConfig('limit') || '50mb'}));
		app.use(bodyParser.urlencoded({  limit: this.getConfig('limit') || '50mb', extended: false }));
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