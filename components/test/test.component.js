'use strict';
import AbstractComponent from '../../src/classes/abstract-component';

import app from '../../src/core-components/app/app';
import sequelize from '../../src/core-components/sequelize/sequelize';

import TestService from '../../services/test-service/test-service';

class Test extends AbstractComponent {
	setup() {
		
		this.set({});
		
		TestService.echo("Moooooo");
		
		app.get().get("/api/testFail/", (req, res, next)=>{
			sequelize.get().Test.create({Comments: "tototo"}).then(()=>{
				res.send("Good");
			});
		});
	}
	
}

export default new Test();