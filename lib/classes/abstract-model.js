'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractClass = require('./abstract-class');

var _abstractClass2 = _interopRequireDefault(_abstractClass);

var _sequelize = require('../core-components/sequelize/sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _sequelize3 = require('sequelize');

var _sequelize4 = _interopRequireDefault(_sequelize3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractModel = function (_AbstractClass) {
	_inherits(AbstractModel, _AbstractClass);

	function AbstractModel() {
		_classCallCheck(this, AbstractModel);

		return _possibleConstructorReturn(this, (AbstractModel.__proto__ || Object.getPrototypeOf(AbstractModel)).apply(this, arguments));
	}

	_createClass(AbstractModel, [{
		key: 'getDataTypes',
		value: function getDataTypes() {
			return _sequelize4.default;
		}
	}, {
		key: 'getModelStructure',
		value: function getModelStructure() {
			return null;
		}
	}, {
		key: 'getModelOptions',
		value: function getModelOptions() {
			return null;
		}
	}, {
		key: 'afterSetup',
		value: function afterSetup() {

			if (!this.getModelStructure()) {
				throw new Error("You must return a sequelize model object in getModelStructure()");
			}
			if (!this.getModelOptions()) {
				throw new Error("You must return the sequelize model option object in getModelOptions()");
			}

			var opts = this.getModelOptions();
			var name = opts.name.singular;
			var model = _sequelize2.default.get().define(opts.name.singular, this.getModelStructure(), opts);
			//var model = sequelize.get().import(define);

			_sequelize2.default.get()[name] = model;
			_sequelize2.default.get()._modelParams[name] = { structure: this.getModelStructure(), options: opts };
		}
	}]);

	return AbstractModel;
}(_abstractClass2.default);

exports.default = AbstractModel;