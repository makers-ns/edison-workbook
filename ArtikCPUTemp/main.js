
var mqtt = require('mqtt');
var fs = require('fs');

var fbuff = '';
var temp1 = 0;
var temp2 = 0;

var fcore1 = "/sys/devices/virtual/thermal/thermal_zone3/temp";
var fcore2 = "/sys/devices/virtual/thermal/thermal_zone4/temp";

var ID = '<Device ID here>';

var PROTOCOL = 'mqtts';
var BROKER ='api.artik.cloud';
var PORT = 8883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;

var AUTHMETHOD = ID;
var AUTHTOKEN = '<Device Token Here>';

var requireds = { username: AUTHMETHOD, password: AUTHTOKEN };
var mqttConfig = { 'url': URL, 'requireds': requireds };

var client;
client = mqtt.connect(mqttConfig.url, mqttConfig.requireds);
var TOPIC = '/v1.1/messages/'+ID;

client.on('connect', function () {
    console.log('connect');
    setInterval(function () {
        getTemp1();
        getTemp2();
        //client.publish(TOPIC, '{"Core1Temp":'+temp1+',"Core2Temp":'+temp2+'}');
    }, 10*1000);//Keeps publishing every 10000 milliseconds.    
});

function getTemp1(){
	var s = '';
	var t = 0;
            
	fs.readFile(fcore1,function(err,data){
		fbuff = data;
		s = fbuff.toString();
		t = parseFloat(s);
		temp1 = t / 1000;
        client.publish(TOPIC, '{"Core1Temp":'+temp1+'}');        
	});
}

function getTemp2(){
    var s = '';
	var t = 0;
	fs.readFile(fcore2,function(err,data){
		fbuff = data;
		s = fbuff.toString();
		t = parseFloat(s);
		temp2 = t / 1000;
        client.publish(TOPIC, '{"Core2Temp":'+temp2+'}');            
	});
}
