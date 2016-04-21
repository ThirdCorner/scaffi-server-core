'use strict';

import AbstractService from '../../extendables/abstract-service';

class NotifyService extends AbstractService{
	requiredComponents(){
		return ['socket-io'];
	}
	initialize(socket) {
		this.socket = socket;
	}
	
	emitCreate(resourceName, data) {
		this.socket.emit("create:" + resourceName, data);
	}
	emitDelete(resourceName, id) {
		this.socket.emit("delete:" + resourceName, id);
	}
	emitUpdate(resourceName, id, data) {
		this.socket.emit("update:" + resourceName + "#" + id, data);
	}
	emitStateChange(resourceName, id, state, data) {
		if(typeof state != 'string') {
			throw new Error("You must pass a status string to transmit statuses");
		}
		console.log("NOTIFY STATE", state, id, resourceName)

		if(id == null) {
			this.socket.emit("state:" + resourceName, {state, data});
		} else {
			this.socket.emit("state:" + resourceName + "#" + id, {state, data});
		}

	}
}

var notify = new NotifyService();

module.exports = function(args){
	notify.call(args);
	return notify;
};