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
	this.data[this.lastId] = {ws: ws, id: this.lastId, name: 'user' + this.lastId};
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
 * Отправить сообщение клиенту
 * @param {string|object} message
 * @param {string} event_name тип сообщения
 * @param {number} client_id id клиента - адресата
 */
Clients.prototype.send = function(message, event_name, client_id) {
    this.data[client_id].ws.send(
        JSON.stringify({'event': event_name, 'content': message, 'time': (new Date).toLocaleTimeString()})
    );
}

/**
 * Отправить сообщение всем клиентам
 * @param {string|object} message
 * @param {string} event_name тип сообщения
 * @param {number} client_id id клиента - автора сообщения
 */
Clients.prototype.sendAll = function(message, event_name, client_id) {
	this.data.forEach(function (client){
		client.ws.send(
			JSON.stringify({'event': event_name, 'name': 'user' + client_id, 'content': message, 'time': (new Date).toLocaleTimeString()})
		);
	});
}

/**
 * Получить имена клиентов, находящихся в сети
 * @returns {Array}
 */
Clients.prototype.getOnline = function() {
    var res = [];
    this.data.forEach(function(client){
        res.push(client.name);
    });
    return res;
}

module.exports.Clients = Clients;