import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import botBuild from "./src/botBuilder";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    handler(ws, message);
  });
});

function handler (ws: WebSocket, event) {
  event = JSON.parse(event);
  if (event.type === 'startBot') {
    ws.send('Start bot...' + event.id);

    const bot = botBuild(require('./config.json'), 'wwhfz', 'traditional');

    bot.on('error.ban', text => {
      ws.send(`Бот говорит что дела плохо. ${text}`);
    });
    bot.on('log.*', function (text) {
      ws.send(`Бот говорит. ${text}`);
    });

    bot.start();
  }
}


server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port 8999 :)`);
});
