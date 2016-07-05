'use strict';

import AbstractComponent from '../../extendables/abstract-component';

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';


class App extends AbstractComponent{
	setup(){
		this.setupApp();
		this.setupAppPresets();
		this.setupAppApis();
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


		if(!this.getParam("environment") || ["production", "development", "qa", "localhost", "cli"].indexOf(this.getParam("environment").toLowerCase()) === -1){
			throw new Error("No valid environment mode provided in app config: " + this.getParam("environment"));
		}

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
	setupAppApis(){
		var app = this.get();
		app.isProductionMode = ()=>{
			return this.getParam("environment").toLowerCase() === "production";
		};
		app.isDevelopmentMode = ()=>{
			return this.getParam("environment").toLowerCase() === "development";
		};
		app.isQaMode = ()=>{
			return this.getParam("environment").toLowerCase() === "qa";
		};
		app.isLocalhostMode = ()=>{
			return this.getParam("environment").toLowerCase() === "localhost";
		};
		app.isCliMode = ()=>{
			return this.getParam("environment").toLowerCase() === "cli";
		};
		app.getEnvironment =()=>{
			return this.getParam("environment").toLowerCase();
		}
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