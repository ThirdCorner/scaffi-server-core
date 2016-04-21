'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import SequelizePackage from 'sequelize';
import fs from 'fs';
import path from 'path';

class Sequelize extends AbstractComponent {
	requiredComponents() {
		return []
	}
	requiredParams(){
		return ['database', 'username', 'password', 'host', 'dialect'];
	}
	setup() {

		var db = {};
		db.connection = this.setupDatabase();
		db.DataTypes = SequelizePackage;

		this.setupModels(db);
		
		this.set(db);
	}
	setupDatabase(){
		return new SequelizePackage(this.getParam('database'), this.getParam('username'), this.getParam('password'), {
			host: this.getParam('host'),
			dialect: this.getParam('dialect'),

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

		});

	}
	setupModels(db){
		var that = this;
		fs
			.readdirSync(path.join(this.getBasePath(), 'models'))
			.filter(function(file) {
				return (file.indexOf(".") !== 0) && (file !== "index.js");
			})
			.forEach(function(file) {
				var model = db.connection.import(path.join(that.getBasePath(), 'models', file));
				db[model.name] = model;
			});

		Object.keys(db).forEach(function(modelName) {
			if ("associate" in db[modelName]) {
				db[modelName].associate(db);
			}
		});
	}
}

export default Sequelize;