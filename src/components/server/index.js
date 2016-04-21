'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import http from 'http';
import debug from 'debug';


class Server extends AbstractComponent {
	requiredComponents(){
		return ["app"];
	}
	setup(app){
		var server = http.createServer(app);
		this.set(server);
	}
	run(app){
		var server = this.get();
		var port = app.get("port");

		server.listen(port);
		server.on('error', (error) => {
			if (error.syscall !== 'listen') {
				throw error;
			}
			
			var bind = typeof port === 'string'
				? 'Pipe ' + port
				: 'Port ' + port;
			
			// handle specific listen errors with friendly messages
			switch (error.code) {
				case 'EACCES':
					console.error(bind + ' requires elevated privileges');
					process.exit(1);
					break;
				case 'EADDRINUSE':
					console.error(bind + ' is already in use');
					process.exit(1);
					break;
				default:
					throw error;
			}
		});
		server.on('listening', () => {
			var addr = server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			debug('Listening on ' + bind);
		});

	}
	
}


export default Server;