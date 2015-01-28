/**
 * @constructor
 */
function Clients() {
	this.data = [];
	this.lastId = 0;
	this.count = 0;
}

/**
 * Добавить клиента
 * @param {object} ws WebSocket-соединение с клиентом
 * @returns {number} id добавленного клиента
 */
Clients.prototype.push = function(ws) {
	this.data[this.lastId] = ws;
	this.count++;
	return this.lastId++;
}

/**
 * Удалить клиента
 * @param {number} client_id
 * @returns {number} оставшееся количество клиентов
 */
Clients.prototype.deleteClient = function(client_id) {
	if (--this.count) {
		delete this.data[client_id];
	}
	return this.count;
}

/**
 * Отправить сообщение всем клиентам
 * @param {string} message
 * @param {string} event_name тип сообщения
 * @param {number} client_id
 */
Clients.prototype.sendAll = function(message, event_name, client_id) {
	this.data.forEach(function (ws){
		ws.send(
			JSON.stringify({'event': event_name, 'name': 'user' + (client_id + 1), 'text': message, 'time': (new Date).toLocaleTimeString()})
		);
	});
}

module.exports.Clients = Clients;