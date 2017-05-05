'use strict';

import AbstractComponent from '../../classes/abstract-component';
import http from 'http';
import debug from 'debug';

import app from '../app/app';

class Server extends AbstractComponent {
	getClassName(){
		return "server";
	}
	setup(){
		var server = http.createServer(app.get());
		this.set(server);
	}
	run(){
		
		app.get().use(function(err, req, res, next){
			console.log("ERROR", err.stack);
			res.status(500).send(err);
		});

		process.on('uncaughtException', function (er) {
			console.log(er.stack)
			process.exit(1)
		});

		var server = this.get();
		var port = app.get().get("port");

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
		console.log("SERVER RUN");
		server.on('listening', () => {
			var addr = server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			console.log('Listening on ' + bind);
		});

	}
	
}


export default new Server();