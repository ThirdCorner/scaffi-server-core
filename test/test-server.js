'use strict';

require("babel-register")({
	"presets": [ "es2015", "stage-0" ],
	"plugins": ["transform-decorators-legacy", "transform-html-import-to-string"]
});

require("./server/index");