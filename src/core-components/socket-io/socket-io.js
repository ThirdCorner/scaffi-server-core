'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import socket from 'socket.io';

class SocketIO extends AbstractComponent {
	setup(app, server) {
		var io = socket.listen(server);
		this.set(io);
	}

}

export default SocketIO;