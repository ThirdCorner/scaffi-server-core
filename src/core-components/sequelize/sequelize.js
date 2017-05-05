'use strict';

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import SequelizePackage from 'sequelize';

import AbstractComponent from '../../classes/abstract-component';

class Sequelize extends AbstractComponent {
	getClassName(){
		return "sequelize";
	}
	setup() {

		var db = this.setupDatabase();
		db.authenticate().then((errors)=>{
			if(!errors) {
				console.log("==== DB CONNECTED ===")
			}
		});
		
		this.set(db);
		
		db._modelParams = {};

	}
	
	setupDatabase() {
		var params = this.getParam("sequelize") || {};
		var options = {
			logging: params.logging || false,
			dialect: params.dialect,
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			},
			define: {
				timestamps: true,// Uncomment later
				createdAt: "CreatedOn",
				updatedAt: "UpdatedOn",
				deletedAt: "DeletedOn",
				paranoid: true,
				//prevent sequelize from pluralizing table names
				freezeTableName: true
			}
		};

		if(params.dialectOptions){
			options.dialectOptions = params.dialectOptions;
		} else {
			options.dialectOptions = {};
		}


		if(params.define) {
			options.define = params.define;
		}




		if(params.dialect == "mssql") {
			if (params.instance) {
				/*
				 http://raathigesh.com/Connecting-To-MSSQL-with-Sequelize/
				 */

				options.dialectOptions.instanceName = params.instance;
			}
			if(params.domain) {
				options.dialectOptions.domain = params.domain;
			}
			if(params.encrypt) {
				options.dialectOptions.encrypt = params.encrypt;
			}
		}
		if(params.host) {
			options.host = params.host;
		}
		if(params.port) {
			options.port = params.port;
		}
		

		if (params.connectionString) {
			return new SequelizePackage(params.connectionString, options)
		} else {
			return new SequelizePackage(params.databaseName, params.username, params.password, options)
		}



	}
	run(){
		var db = this.get();
		
		_.each(db._modelParams, (data, name)=>{
			if ("associate" in db[name]) {
				db[name].associate(db);
			}
		});
		
	}
}

export default new Sequelize();