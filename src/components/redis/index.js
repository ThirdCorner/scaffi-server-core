'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import redis from 'redis';

class Redis extends AbstractComponent {
	requiredComponents(){
		return [];
	}
	setup() {
		var client = redis.createClient();
		client.on("error", function (err) {
			console.log("REDIS Error " + err);
		});
		client.on("connect", function(){
			console.log("REDIS connected");
		});
		
		this.set(client);
	}

}

export default Redis;