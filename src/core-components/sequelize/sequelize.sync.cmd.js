import _ from "lodash";
import sequelizeFixtures from 'sequelize-fixtures';

import sequelize from './sequelize';

class SyncModels {
	run(){
		// sequelize.get().connection.sync({force: true}).then(()=>{
		// 	console.log("### DB MODELS SYNCED ###");
		// 	var fixtures = [];
		// 	var idCounters = {};
		// 	try {
		// 		// this.loadFiles(path.join(that.getBasePath(),"fixtures"), (file, filename)=>{
		// 		// 	this._parseFixture(fixtures, idCounters, filename, file);
		// 		//
		// 		// });
		// 	} catch(e){
		// 		console.log(e);
		// 	}
		//
		// 	// console.log(fixtures);
		// 	sequelizeFixtures.loadFixtures(fixtures, db).then(()=>{
		// 		console.log(`### You have been successfully seeded ###`);
		// 	});
		// });
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
}