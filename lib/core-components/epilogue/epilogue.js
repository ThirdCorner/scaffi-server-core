'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _epilogue = require('epilogue');

var _epilogue2 = _interopRequireDefault(_epilogue);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _app = require('../app/app');

var _app2 = _interopRequireDefault(_app);

var _sequelize = require('../sequelize/sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _abstractComponent = require('../../classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import UiNotifyService from '../../services/ui-notify-service/ui-notify-service';

var Epilogue = function (_AbstractComponent) {
	_inherits(Epilogue, _AbstractComponent);

	function Epilogue() {
		_classCallCheck(this, Epilogue);

		return _possibleConstructorReturn(this, (Epilogue.__proto__ || Object.getPrototypeOf(Epilogue)).apply(this, arguments));
	}

	_createClass(Epilogue, [{
		key: 'getClassName',
		value: function getClassName() {
			return "epilogue";
		}
	}, {
		key: 'setup',
		value: function setup() {
			var db = _sequelize2.default.get();
			_epilogue2.default.initialize({
				app: _app2.default.get(),
				sequelize: db
			});

			this.set(_epilogue2.default);
		}
	}, {
		key: 'setupErrorRouteOverride',
		value: function setupErrorRouteOverride(route) {

			var milestones = ["create", "delete", "list", "read", "update"];
			_lodash2.default.each(milestones, function (name) {
				route.controllers[name].error = function (req, res, error) {
					if (error.cause) {
						console.log(error.cause);
					}

					console.log(error.stack);
					res.sendError(error.message, error.cause || error.stack);
				};
			});
		}
		// setupSocketRoute(route) {
		// 	var namespace = route.model.name;
		//
		// 	/*
		// 		Stringify any non-scalars before they hit the DB
		// 	 */
		// 	route.create.write.before(function(req, res, context){
		// 		_.forEach(req.body, (value, name)=>{
		// 			if(_.isObject(value)) {
		// 				req.body[name] = JSON.stringify(value);
		// 			}
		// 		});
		// 		return context.continue;
		// 	});
		// 	route.update.write.before(function(req, res, context){
		// 		_.forEach(req.body, (value, name)=>{
		// 			if(_.isObject(value)) {
		// 				req.body[name] = JSON.stringify(value);
		// 			}
		// 		});
		// 		return context.continue;
		// 	});
		//
		// 	route.update.send.before(function(req, res, context){
		// 		UiNotifyService.emitUpdate(namespace, context.attributes.id, context.attributes);
		// 		return context.continue;
		// 	});
		// 	route.create.send.before(function(req, res, context){
		// 		UiNotifyService.emitCreate(namespace, context.attributes);
		// 		return context.continue;
		// 	});
		// 	route.delete.send.before(function(req, res, context){
		// 		UiNotifyService.emitDelete(namespace, context.criteria.id, true);
		// 		return context.continue;
		// 	});
		// }

	}]);

	return Epilogue;
}(_abstractComponent2.default);

exports.default = new Epilogue();