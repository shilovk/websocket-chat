"use strict";

window.onload = function() {
	document.querySelector('#go').onclick = start;
	function start() {
		this.style.display = 'none';
		var websocket = new WebSocket("ws://" + (config.host ? config.host : location.host) + ":" + config.port),
			client_id,
			timeout_id;

        /**
         * Подключенные клиенты
         */
        var connected_clients;
        (function(exports){
            var data = {};
            /**
             * Добавить клиента
             * @param {object} json_msg
             */
            exports.push = function (json_msg) {
                data[json_msg.name] = {alias: ""};
                return this;
            };
            /**
             * Удалить клиента
             * @param {object} json_msg
             */
            exports.deleteClient = function (json_msg) {
                delete data[json_msg.name];
                return this;
            };
            /**
             * Отрисовать всех подключенных клиентов
             */
            exports.render = function () {
                var content = "";
                for (var name in data) {
                    content += "<p><span class='s_name'>" + name + "<span></p>";
                }
                document.querySelector('#status').innerHTML = content;
                return this;
            }
        })(connected_clients = {});

		websocket.onmessage = function(msg) {
			var json_msg = JSON.parse(msg.data);
			switch (json_msg.event) {				
				case "connected":
                    if (!client_id) {
                        client_id = json_msg.name;
                    }
                    else {
                        connected_clients.push(json_msg).render();
                        renderMessage(json_msg);
                    }
                    break;
				case "disconnected":
                    connected_clients.deleteClient(json_msg).render();
                    renderMessage(json_msg);
                    break;
				case "message": {
					renderMessage(json_msg);
					break; 
				}
				case "typing": {
					if (client_id === json_msg.name) {
						return;
					}
					var h_template = Handlebars.compile("<span>{{name}} набирает...</span>");
					document.querySelector('#info').innerHTML = h_template(json_msg);
					timeout_id = timeout_id || setTimeout(function() { document.querySelector('#info').innerHTML = ''; timeout_id = null }, 2000)
					break;
				}
			}
            function renderMessage(json_msg) {
                var h_template = Handlebars.compile(
                    "<p><span class='m_name'>{{name}}</span> <span class='m_time'>{{time}}</span> <span class='m_event'>{{event}}</span> <span class='m_text'>{{text}}</span></p>"
                );
                document.querySelector('#log').innerHTML += h_template(json_msg);
                document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
            }
		};

		document.querySelector('#send').onclick = function() {
			websocket.send(
				JSON.stringify({event: "message", text: encodeURI(document.querySelector('#input').value)})
			);
			document.querySelector('#input').value = '';
		};		
		document.querySelector('#input').onkeypress = function(e) {
			if (e.which == '13') {
				document.querySelector('#send').onclick();
                e.preventDefault();
				return;
			}
			websocket.send(
				JSON.stringify({event: "typing", state: true})
			);
		};
	}
};