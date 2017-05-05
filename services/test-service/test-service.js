'use strict';

import AbstractService from '../../src/classes/abstract-service';

class TestService extends AbstractService{
	setup() {
		console.log("test notify service!");
	}
	echo(text){
		console.log("TEST SERVICE ECHO: ", text);
	}
}

export default new TestService();