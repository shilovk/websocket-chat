"use strict";

var config = {port: 8080};

var WebSocketServer = require('ws').Server,
	clients_module = require('./clients-server'),
	wss = new WebSocketServer({ port: config.port }),
	clients = new clients_module.Clients();
	
wss.on('connection', function (ws) {
	var client_id = clients.push(ws);
	clients.sendAll('', 'connected', client_id);	
	
	ws.on('message', function (msg) {
		var json_msg = JSON.parse(msg);
		switch (json_msg.event) {
			case "message":
				clients.sendAll(decodeURI(json_msg.text), 'message', client_id);
				break;
			case "typing":
				clients.sendAll('', 'typing', client_id);
				break;
		}
	});
	
	ws.on('close', function close() {
		if (clients.deleteClient(client_id) === 0) {
			clients = new clients_module.Clients();
			return;
		}
		clients.sendAll('', 'disconnected', client_id);
	});
});