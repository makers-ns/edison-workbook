
// Load Grove module
var groveSensor = require('jsupm_grove');

var webSocketUrl = "wss://api.artik.cloud/v1.1/websocket?ack=true";
var device_id = "<YOUR DEVICE ID>";
var device_token = "<YOUR DEVICE TOKEN>";

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
console.log(temp.name());

function getTimeMillis(){
    return parseInt(Date.now().toString());
}

function start() {
    //Create the WebSocket connection
    isWebSocketReady = false;
    ws = new WebSocket(webSocketUrl);
    ws.on('open', function() {
        console.log("WebSocket connection is open ....");
        register();
    });
    ws.on('message', function(data) {
         console.log("Received message: " + data + '\n');
         handleRcvMsg(data);
    });
    ws.on('close', function() {
        console.log("WebSocket connection is closed ....");
        isWebSocketReady = false;
    });

}

function register(){
    console.log("Registering device on the WebSocket connection");
    try{
        var registerMessage = '{"type":"register", "sdid":"'+device_id+'", "Authorization":"bearer '+device_token+'", "cid":"'+getTimeMillis()+'"}';
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
        isWebSocketReady = true;
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' + e.toString());
    }    
}

function handleRcvMsg(msg){
    var msgObj = JSON.parse(msg);
    if (msgObj.type != "action") return; //Early return;

    var actions = msgObj.data.actions;
    var actionName = actions[0].name; //assume that there is only one action in actions
    console.log("The received action is " + actionName);

}

function sendTempToArtikCloud(value){
    try{
        ts = ', "ts": '+getTimeMillis();

        if (isWebSocketReady){
            var data = {
                "temp": value
            };
            var payload = '{"sdid":"'+device_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
            console.log('Sending payload ' + payload + '\n');
            ws.send(payload, {mask: true});
        }        
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString() +'\n');
    }    
}

var loop = setInterval(function() {
        if (!isWebSocketReady){
            start();
        }
        var celsius = temp.value();
        console.log(celsius + " degrees Celsius ");
        sendTempToArtikCloud(celsius);
        }, 2*60*1000);
