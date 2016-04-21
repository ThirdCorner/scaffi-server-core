'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import session from 'express-session';

class SessionConnect extends AbstractComponent {
	requiredComponents(){
		return ['app', 'redis-connect'];
	}
	requiredParams(){
		return ['secretKey', 'resave', 'saveUninitialized'];
	}
	setup(app, redisConnect) {
		var obj = {
			secret: this.getParam("secretKey"),
			store: redisConnect.registerStore(session),
			cookie: {maxAge: 60000},
			resave: this.getParam("resave"),
			saveUninitialized: this.getParam("saveUninitialized")
		};
		var createdSession = session(obj);
		console.log(createdSession)
		app.use(createdSession);

		this.set(createdSession);
	}

}

export default SessionConnect;