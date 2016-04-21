'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import RedisStore from 'connect-redis';

class Redis extends AbstractComponent {
	requiredComponents(){
		return ['app', 'redis'];
	}
	requiredParams(){
		return [];
		//return ['secretKey', 'resave', 'saveUninitialized'];
	}
	setup(app, redis) {
		var that = this;
		var redisConnectInterface = {
			registerStore: (registerObj) =>{
				var store = RedisStore(registerObj);
				
				var obj = {
					host: 'localhost',
					port: 6379,
					client: redis
				};
				
				return new store(obj);
				
			}
		};
		
		this.set(redisConnectInterface);
	}

}

export default Redis;/**
 * Created by Joseph on 4/11/2016.
 */
