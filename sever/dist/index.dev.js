"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WEBSOCKET = require('ws');

var UUIDV1 = require('uuid/v1');

var STATE_CONNECT = 'connected';
var STATE_READY = 'ready';
var STATE_RUNNING = 'gamerunning';

var DataPlayerForMutilPlay = function DataPlayerForMutilPlay(id, x, score) {
  _classCallCheck(this, DataPlayerForMutilPlay);

  this.id = id;
  this.x = x;
  this.status = 0;
  this.key = '';
}; //Init sever


var webSocketSever = new WEBSOCKET.Server({
  port: 8080
});
var users = {};
webSocketSever.on('connection', function connection(ws) {
  var playerInfomation = new DataPlayerForMutilPlay(UUIDV1(), 0, 0);
  playerInfomation.ws = ws;
  playerInfomation.key = STATE_CONNECT;
  users[playerInfomation.id] = playerInfomation;
  ws.send(JSON.stringify({
    'id': playerInfomation.id,
    'x': playerInfomation.x,
    'score': playerInfomation.score,
    'key': playerInfomation.key,
    'type': 'Me'
  }));
  console.log('Infomation Init');
  console.log('Client: ' + playerInfomation.id + 'connected sever');
  webSocketSever.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WEBSOCKET.OPEN) {
      console.log('client !== ws');
    }
  });

  for (var userid in users) {
    var us = users[userid];
    console.log(userid);

    if (us.ws != ws) {
      us.ws.send(JSON.stringify({
        'id': playerInfomation.id,
        'x': playerInfomation.x,
        'score': playerInfomation.score,
        'key': 'RIVAL'
      }));
      ws.send(JSON.stringify({
        'id': playerInfomation.id,
        'x': playerInfomation.x,
        'score': playerInfomation.score,
        'key': 'RIVAL'
      }));
    }
  }

  ws.on('message', function (data) {
    var playerdata = JSON.parse(data);

    if (playerdata.type == STATE_READY) {
      console.log("Recevied mesage from client: => ".concat(data));
    }

    var pack = new Array();

    if (playerdata.type == STATE_RUNNING) {
      console.log('Send data: ');
    }

    for (var id in users) {
      users[id].ws.send(JSON.stringify(pack));
    }
  });
  ws.on('close', function (message) {
    console.log('closing sever side ');
    console.log(message);
    console.log(wss.clients.length);

    for (var obj in users) {
      console.log(obj);

      if (users[obj].ws == ws) {
        console.log("remove client --");
        delete users[obj];
        break;
      }
    }

    console.log('clients size : ' + Object.keys(users).length);
  });
  ws.on('error', function (code, reason) {
    console.log(code);
  });
});