'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _abstractComponent = require('../../classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sequelize = function (_AbstractComponent) {
	_inherits(Sequelize, _AbstractComponent);

	function Sequelize() {
		_classCallCheck(this, Sequelize);

		return _possibleConstructorReturn(this, (Sequelize.__proto__ || Object.getPrototypeOf(Sequelize)).apply(this, arguments));
	}

	_createClass(Sequelize, [{
		key: 'getClassName',
		value: function getClassName() {
			return "sequelize";
		}
	}, {
		key: 'setup',
		value: function setup() {

			var db = this.setupDatabase();
			db.authenticate().then(function (errors) {
				if (!errors) {
					console.log("==== DB CONNECTED ===");
				}
			});

			this.set(db);

			db._modelParams = {};
		}
	}, {
		key: 'setupDatabase',
		value: function setupDatabase() {
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
					timestamps: true, // Uncomment later
					createdAt: "CreatedOn",
					updatedAt: "UpdatedOn",
					deletedAt: "DeletedOn",
					paranoid: true,
					//prevent sequelize from pluralizing table names
					freezeTableName: true
				}
			};

			if (params.dialectOptions) {
				options.dialectOptions = params.dialectOptions;
			} else {
				options.dialectOptions = {};
			}

			if (params.define) {
				options.define = params.define;
			}

			if (params.dialect == "mssql") {
				if (params.instance) {
					/*
      http://raathigesh.com/Connecting-To-MSSQL-with-Sequelize/
      */

					options.dialectOptions.instanceName = params.instance;
				}
				if (params.domain) {
					options.dialectOptions.domain = params.domain;
				}
				if (params.encrypt) {
					options.dialectOptions.encrypt = params.encrypt;
				}
			}
			if (params.host) {
				options.host = params.host;
			}
			if (params.port) {
				options.port = params.port;
			}

			if (params.connectionString) {
				return new _sequelize2.default(params.connectionString, options);
			} else {
				return new _sequelize2.default(params.databaseName, params.username, params.password, options);
			}
		}
	}, {
		key: 'run',
		value: function run() {
			var db = this.get();

			_lodash2.default.each(db._modelParams, function (data, name) {
				if ("associate" in db.name) {
					db[name].associate(db);
				}
			});
		}
	}]);

	return Sequelize;
}(_abstractComponent2.default);

exports.default = new Sequelize();