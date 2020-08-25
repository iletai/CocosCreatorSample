
const WEBSOCKET = require('ws')
const UUIDV1 = require('uuid/v1');

const STATE_CONNECT = 'connected';
const STATE_READY = 'ready';
const STATE_RUNNING = 'gamerunning'


class DataPlayerForMutilPlay {
    constructor(id, x, score) {
        this.id = id;
        this.x = x;
        this.status = 0;
        this.key = '';
    }
}

//Init sever
const webSocketSever = new WEBSOCKET.Server({ port: 8080 })
var users =
{

};

webSocketSever.on('connection', function connection(ws) {
    let playerInfomation = new DataPlayerForMutilPlay(UUIDV1(), 0, 0);
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

    for (let userid in users) {
        let us = users[userid];
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

    ws.on('message', data => {
        let playerdata = JSON.parse(data);
        if (playerdata.type == STATE_READY) {
            console.log(`Recevied mesage from client: => ${data}`);
        }

        let pack = new Array();
        if (playerdata.type == STATE_RUNNING) {
            console.log('Send data: ');
        }

        for (let id in users) {
            users[id].ws.send(JSON.stringify(pack));
        }

    });

    ws.on('close', message => {
        console.log('closing sever side ');
        console.log(message);
        console.log(wss.clients.length);
        for (let obj in users) {
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
