'use strict';

import AbstractService from '../../src/extendables/abstract-service';

class TestService extends AbstractService{
	initialize() {
		console.log("test notify service!");
		console.log(this.getParam("name"));
	}
	echo(text){
		console.log("TEST SERVICE ECHO: ", text);
	}
}
var Service = new TestService();
export default Service;