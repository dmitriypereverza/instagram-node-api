import WebSocket from "ws";

const ws = new WebSocket('ws://localhost:8999');

ws.on('open', function open() {
  ws.send(JSON.stringify({
    type: 'startBot',
    id: 3
  }));
});

ws.on('message', function (msg) {
  console.log('Client -> ' + msg);
});
