'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _sequelizeFixtures = require('sequelize-fixtures');

var _sequelizeFixtures2 = _interopRequireDefault(_sequelizeFixtures);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sequelize = function (_AbstractComponent) {
	_inherits(Sequelize, _AbstractComponent);

	function Sequelize() {
		_classCallCheck(this, Sequelize);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Sequelize).apply(this, arguments));
	}

	_createClass(Sequelize, [{
		key: 'setup',
		value: function setup() {

			var db = {};
			db.connection = this.setupDatabase();

			db.connection.authenticate().then(function (errors) {
				if (!errors) {
					console.log("==== DB CONNECTED ===");
				}
			});

			db.DataTypes = _sequelize2.default;

			this.setupModels(db);

			this.set(db);

			var that = this;

			if (this.getParam("sync") === true) {
				db.connection.sync({ force: true }).then(function () {
					console.log("### DB MODELS SYNCED ###");
					var fixtures = [];
					var idCounters = {};
					try {
						that.loadFiles(_path2.default.join(that.getBasePath(), "fixtures"), function (file, filename) {
							that._parseFixture(fixtures, idCounters, filename, file);
						});
					} catch (e) {
						console.log(e);
					}

					// console.log(fixtures);
					_sequelizeFixtures2.default.loadFixtures(fixtures, db).then(function () {
						console.log('### You have been successfully seeded ###');
					});
				});
			}
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
	}, {
		key: 'setupDatabase',
		value: function setupDatabase() {
			var options = {
				logging: true,
				dialect: this.getParam('dialect'),
				pool: {
					max: 5,
					min: 0,
					idle: 10000
				},
				define: {
					timestamps: true, // Uncomment later
					createdAt: "CreatedOn",
					updatedAt: "UpdatedOn",
					deletedAt: "DeletedOn",
					paranoid: true,
					//prevent sequelize from pluralizing table names
					freezeTableName: true
				}
			};

			if (this.getParam("dialect") == "mssql" && this.getParam("instance")) {
				/*
     http://raathigesh.com/Connecting-To-MSSQL-with-Sequelize/
     */

				options.dialectOptions = {
					instanceName: this.getParam("instance")
				};
			}
			if (this.getParam('host')) {
				options.host = this.getParam('host');
			}
			if (this.getParam("port")) {
				options.port = this.getParam("port");
			}

			if (this.getParam("connectionString")) {
				return new _sequelize2.default(this.getParam("connectionString"), options);
			} else {
				return new _sequelize2.default(this.getParam("databaseName"), this.getParam("username"), this.getParam("password"), options);
			}
		}
	}, {
		key: 'setupModels',
		value: function setupModels(db) {
			var that = this;
			try {
				_fs2.default.readdirSync(_path2.default.join(this.getBasePath(), 'models')).filter(function (file) {
					return file.indexOf(".") !== 0 && file !== "index.js";
				}).forEach(function (file) {
					var model = db.connection.import(_path2.default.join(that.getBasePath(), 'models', file));
					db[model.name] = model;
				});

				Object.keys(db).forEach(function (modelName) {
					if ("associate" in db[modelName]) {
						db[modelName].associate(db);
					}
				});
			} catch (e) {
				throw new Error("Trying to get models but can't load for sequelize. You sure you have a folder on at root?");
			}
		}
	}]);

	return Sequelize;
}(_abstractComponent2.default);

exports.default = Sequelize;