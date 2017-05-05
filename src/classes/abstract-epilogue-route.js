import AbstractRoute from './abstract-route';
import epilogue from '../core-components/epilogue/epilogue';

class AbstractEpilogueRoute extends AbstractRoute {

	afterSetup(){
		if(!this.get()){
			throw new Error("You must set the epilogue resource in this.set() so that hooks can be attached to it.");
		}
		
		epilogue.setupErrorRouteOverride(this.get());
		//epilogue.setupSocketRoute(this.get());
	}
}

export default AbstractEpilogueRoute;
