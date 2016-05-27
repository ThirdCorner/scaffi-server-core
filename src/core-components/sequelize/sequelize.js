'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import SequelizePackage from 'sequelize';
import fs from 'fs';
import path from 'path';

class Sequelize extends AbstractComponent {
	setup() {

		var db = {};
		db.connection = this.setupDatabase();

		db.connection.authenticate().then((errors)=>{
			if(!errors) {
				console.log("==== DB CONNECTED ===")
			}
		});

		db.DataTypes = SequelizePackage;

		this.setupModels(db);
		
		this.set(db);


		if(this.getParam("sync") === true) {
			db.connection.sync().then(()=>{
				console.log("~~~ DB SYNCED ~~~");
			});
		}
	}
	setupDatabase(){
		var opts = {
			// host: "localhost",
			// dialect: "mssql",
			host: this.getParam('host'),
			dialect: this.getParam('dialect'),
			port: this.getParam("port"),
			// disable logging; default: console.log
			logging: false,

			pool: {
				max: 5,
				min: 0,
				idle: 10000
			},
			define: {
				timestamps: false,// Uncomment later
				//prevent sequelize from pluralizing table names
				freezeTableName: true
			}

		};
		if(this.getParam("dialect") == "mssql") {
			/*
			    http://raathigesh.com/Connecting-To-MSSQL-with-Sequelize/
			 */
			opts.dialectOptions = {
				instanceName: "sqlexpress",
				//domain: "JJSPC"
			};
		}
		return new SequelizePackage(this.getParam("databaseName"), this.getParam("username"), this.getParam("password"), opts)
		//return new SequelizePackage(this.getParam('databaseName'), this.getParam('username'), this.getParam('password'), opts)


	}
	setupModels(db){
		var that = this;
		try {
			fs
				.readdirSync(path.join(this.getBasePath(), 'models'))
				.filter(function (file) {
					return (file.indexOf(".") !== 0) && (file !== "index.js");
				})
				.forEach(function (file) {
					var model = db.connection.import(path.join(that.getBasePath(), 'models', file));
					db[model.name] = model;
				});

			Object.keys(db).forEach(function (modelName) {
				if ("associate" in db[modelName]) {
					db[modelName].associate(db);
				}
			});
		} catch(e) {
			throw new Error("Trying to get models but can't load for sequelize. You sure you have a folder on at root?");
		}
	}
}

export default Sequelize;