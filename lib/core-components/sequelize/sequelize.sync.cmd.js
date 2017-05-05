'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sequelizeFixtures = require('sequelize-fixtures');

var _sequelizeFixtures2 = _interopRequireDefault(_sequelizeFixtures);

var _sequelize = require('./sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncModels = function () {
	function SyncModels() {
		_classCallCheck(this, SyncModels);
	}

	_createClass(SyncModels, [{
		key: 'run',
		value: function run() {
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
	}, {
		key: '_parseFixture',
		value: function _parseFixture(fixtures, idCounters, filename, file, parentName, parentValue) {
			if (_lodash2.default.isFunction(file)) {
				file = file();
			}
			if (file.default) {
				file = file.default;
			}
			if (!_lodash2.default.isArray(file)) {
				console.log(file);
				throw new Error('Trying to load ' + filename + ' as fixture load but file does not return an array');
			}

			var name = filename;
			if (filename.indexOf(".") !== -1) {
				name = filename.substr(0, filename.indexOf("."));
			}
			var that = this;
			if (!_lodash2.default.has(idCounters, name)) {
				idCounters[name] = 0;
			}
			_lodash2.default.forEach(file, function (item, key) {
				/*
    	Need to abstract based on their id naming scheme
     */
				idCounters[name]++;
				var id = idCounters[name];
				item.id = id;

				if (parentName) {
					item[parentName] = parentValue;
				}

				fixtures.push({
					model: name,
					data: item
				});

				/* see if item has any nested items */
				_lodash2.default.forEach(item, function (propValue, propName) {
					if (_lodash2.default.isArray(propValue)) {
						that._parseFixture(fixtures, idCounters, propName, propValue, name + "Id", id);
					}
				});
			});
			console.log('~~~ Adding Fixture Data: ' + filename + ' ~~~');
		}
	}]);

	return SyncModels;
}();