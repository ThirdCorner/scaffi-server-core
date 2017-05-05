'use strict';

import AbstractService from '../../classes/abstract-service';

class UiNotifyService extends AbstractService{
	initialize(socket) {
		this.socket = socket;
	}
	
	emitCreate(resourceName, data) {
		if(this.socket) {
			this.socket.emit("create:" + resourceName, data);
		}
	}
	emitDelete(resourceName, id) {
		if(this.socket) {
			this.socket.emit("delete:" + resourceName, id);
		}
	}
	emitUpdate(resourceName, id, data) {
		if(this.socket) {
			this.socket.emit("update:" + resourceName + "#" + id, data);
		}
	}
	emitStateChange(resourceName, id, state, data) {
		if(this.socket) {
			if (typeof state != 'string') {
				throw new Error("You must pass a status string to transmit statuses");
			}
			console.log("NOTIFY STATE", state, id, resourceName)
			
			if (id == null) {
				this.socket.emit("state:" + resourceName, {state, data});
			} else {
				this.socket.emit("state:" + resourceName + "#" + id, {state, data});
			}
		}

	}
}

var Service = new UiNotifyService();
export default Service;