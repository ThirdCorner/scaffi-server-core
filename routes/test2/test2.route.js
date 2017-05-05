import AbstractRoute from '../../src/classes/abstract-route';
import app from '../../src/core-components/app/app';

class Test2 extends AbstractRoute {
	setup(){
		app.get().get('/api/test2', (req, res, next)=>{
			res.sendSuccess("I'm a good test");
		});
	}
}

export default new Test2();