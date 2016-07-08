'use strict';
import TestService from '../../services/test-service/test-service';
import AbstractComponent from '../../src/extendables/abstract-component';

class Test extends AbstractComponent {
	setup(app, router, db) {
		if(!app) {
			throw new Error("app not provide for test component");
		}
		
		this.set({});
		
		TestService.echo("Moooooo");
		
		router.list("/api/testFail/", (req, res, next)=>{
			db.Test.create({Comments: "tototo"}).then(()=>{
				res.send("Good");
			});
		});
	}
	
}

export default Test;