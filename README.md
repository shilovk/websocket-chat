# websocket-chat
`websocket-chat` is a simple Chat Client/Server based on WebSocket. It uses [ws: a node.js websocket library][ws]
for connecting to websocket on the server.

### Installing

#### Linux

```
git clone https://github.com/ollazarev/websocket-chat
cd websocket-chat
npm run build
```

#### Windows

**NOTE:** `w_preinstall` script will install Gulp.js globally on your system.

```
git clone https://github.com/ollazarev/websocket-chat
cd websocket-chat
npm run w_preinstall
npm run w_build
```

### Starting server

Execute the following command in the root project's directory:

```
npm start
```

### Using chat

1) Edit `dest/client/index.html` and set host of the server in Javascript `config` variable.

2) Open `dest/client/index.html` chat window and start talking!

[ws]: http://einaros.github.io/ws/