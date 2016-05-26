'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
			db.DataTypes = _sequelize2.default;

			this.setupModels(db);

			this.set(db);
		}
	}, {
		key: 'setupDatabase',
		value: function setupDatabase() {
			return new _sequelize2.default(this.getParam('databaseName'), this.getParam('username'), this.getParam('password'), {
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
					timestamps: false, // Uncomment later
					//prevent sequelize from pluralizing table names
					freezeTableName: true
				}

			});
		}
	}, {
		key: 'setupModels',
		value: function setupModels(db) {
			var that = this;
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
		}
	}]);

	return Sequelize;
}(_abstractComponent2.default);

exports.default = Sequelize;