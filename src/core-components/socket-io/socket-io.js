'use strict';

import AbstractComponent from '../../classes/abstract-component';
import socket from 'socket.io';

import app from '../app/app';
import server from '../server/server';

class SocketIO extends AbstractComponent {
	setup() {
		var io = socket.listen(server.get());
		this.set(io);
	}

}

export default new SocketIO();