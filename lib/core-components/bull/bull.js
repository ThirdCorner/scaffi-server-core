'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractComponent = require('../../extendables/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _bull = require('bull');

var _bull2 = _interopRequireDefault(_bull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bull = function (_AbstractComponent) {
	_inherits(Bull, _AbstractComponent);

	function Bull() {
		_classCallCheck(this, Bull);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Bull).apply(this, arguments));
	}

	_createClass(Bull, [{
		key: 'setup',
		value: function setup(redis) {

			var BullInterface = {
				create: function create(args) {
					if (!args.queueName) throw new Error("You must pass a queueName into bull.create");

					var queue = (0, _bull2.default)(args.queueName);

					return queue;
				},
				getDataByQueue: function getDataByQueue(qName, type, cb) {
					var returnData = [];
					qName = "bull:" + qName;
					var key = qName + ":" + type;
					redis.lrange(key, 0, -1, function (error, ids) {
						var count = ids.length;
						if (!count) {
							cb([]);
						}
						ids.forEach(function (id) {
							var jobKey = qName + ':' + id;
							redis.hgetall(jobKey, function (error, data) {
								if (!error) {
									returnData.push({
										id: id,
										data: data.data || {}
									});
								}

								count--;
								if (count < 1) {
									cb(returnData);
								}
							});
						});
					});
				}
			};

			this.set(BullInterface);
		}
	}]);

	return Bull;
}(_abstractComponent2.default);

exports.default = Bull;