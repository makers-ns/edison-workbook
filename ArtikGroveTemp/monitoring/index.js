
// Load Grove module
var webSocketUrl = "wss://api.artik.cloud/v1.1/live?";
webSocketUrl += "Authorization=bearer+<YOUR DEVICE TOKEN>"
var WebSocket = require('ws');
var isWebSocketReady = false;
var ws = null;

function start() {
    //Create the WebSocket connection
    isWebSocketReady = false;
    ws = new WebSocket(webSocketUrl);
    ws.on('open', function() {
        console.log("WebSocket connection is open ....");
        //register();
    });
    ws.on('message', function(data) {
         console.log("Received message: " + data + '\n');
         handleRcvMsg(data);
    });
    ws.on('close', function() {
        console.log("WebSocket connection is closed ....");
    });

}

function handleRcvMsg(msg){
    var msgObj = JSON.parse(msg);

    if (typeof msgObj.mid !== 'undefined' && msgObj.mid) {
        console.log(msgObj.mid)
    }

}

start();
