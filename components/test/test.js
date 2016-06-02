'use strict';

import AbstractComponent from '../../src/extendables/abstract-component';

class Test extends AbstractComponent {
	setup(app) {
		if(!app) {
			throw new Error("app not provide for test component");
		}
		
		this.set({});
	}
	
}

export default Test;