require("babel-register")({
	presets: [ 'es2015' ]
});

var path = require('path');
var ScaffiCore = require("../../src/index");

ScaffiCore.initialize({});

/*
	Nede to get es2015 runnig for this so I can test each logic piece
 */