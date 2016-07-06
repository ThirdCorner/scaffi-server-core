'use strict';

import AbstractService from '../../src/extendables/abstract-service';

class TestService extends AbstractService{
	initialize(app) {
		console.log("test notify service!");
	}
	echo(text){
		console.log("TEST SERVICE ECHO: ", text);
	}
}
var Service = new TestService();
export default Service;