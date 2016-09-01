require("babel-register")({
	presets: [ 'es2015' ]
});

var path = require('path');
var ScaffiCore = require("../../src/index");

ScaffiCore.initialize({
	"components": {
		"sequelize": {
			"username": "admin2",
			"password": "password2"
		}
	}
});


console.log(ScaffiCore.config.get());