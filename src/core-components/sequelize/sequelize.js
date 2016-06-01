'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import SequelizePackage from 'sequelize';
import sequelizeFixtures from 'sequelize-fixtures';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

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

		var that = this;

		if(this.getParam("sync") === true) {
			db.connection.sync({force: true}).then(()=>{
				console.log("### DB MODELS SYNCED ###");
				var fixtures = [];
				var idCounters = {};
				try {
					that.loadFiles(path.join(that.getBasePath(),"fixtures"), function(file, filename){
						that._parseFixture(fixtures, idCounters, filename, file);
						
					});
				} catch(e){
					console.log(e);
				}

				// console.log(fixtures);
				sequelizeFixtures.loadFixtures(fixtures, db).then(()=>{
					console.log(`### You have been successfully seeded ###`);
				});
			});
		}
	}
	_parseFixture(fixtures, idCounters, filename, file, parentName, parentValue) {
		if(_.isFunction(file)){
			file = file();
		}
		if(file.default) {
			file = file.default;
		}
		if(!_.isArray(file)) {
			console.log(file);
			throw new Error(`Trying to load ${filename} as fixture load but file does not return an array`);
		}

		var name = filename;
		if(filename.indexOf(".") !== -1) {
			name = filename.substr(0, filename.indexOf("."));
		}
		var that = this;
		if(!_.has(idCounters, name)) {
			idCounters[name] = 0;
		}
		_.forEach(file, (item, key)=>{
			/*
				Need to abstract based on their id naming scheme
			 */
			idCounters[name]++;
			var id = idCounters[name];
			item.id = id;

			if(parentName) {
				item[parentName] = parentValue;
			}

			fixtures.push({
				model: name,
				data: item
			});

			/* see if item has any nested items */
			_.forEach(item, (propValue, propName)=>{
				if(_.isArray(propValue)) {
					that._parseFixture(fixtures, idCounters, propName, propValue, name + "Id", id);
				}
			});

		});
		console.log(`~~~ Adding Fixture Data: ${filename} ~~~`);
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