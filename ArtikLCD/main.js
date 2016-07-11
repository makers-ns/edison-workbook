/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)

var mqtt = require('mqtt');
var mraa = require('mraa');
var LCD = require('jsupm_i2clcd');

var ID = '6adba2ccc72e4e8190b553618ace81a0';

var PROTOCOL = 'mqtts';
var BROKER ='api.artik.cloud';
var PORT = 8883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;

var AUTHMETHOD = ID;
var AUTHTOKEN = '3dbe7dca11e14f5682e4f986a9647c83';

var requireds = { username: AUTHMETHOD, password: AUTHTOKEN };
var mqttConfig = { 'url': URL, 'requireds': requireds };

var client;
client = mqtt.connect(mqttConfig.url, mqttConfig.requireds);


var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

client.on('connect', function () {
    console.log('connect');
    client.subscribe('/v1.1/actions/'+ID);
});

client.on('message', function (topic, message) {
  // message is Buffer 
    console.log(message.toString());
    json = JSON.parse(message.toString());
    //console.dir(json);
    console.log(json.actions[0].name);
    var action = json.actions[0].name;

    json.actions.forEach(function(entry){
        if (entry.name == 'clean'){
            myLcd.clear();
            console.log('cleaning LCD');
        }
        if (entry.name == 'setText'){
            myLcd.setCursor(0,0);
            myLcd.write(entry.parameters.line1);
            myLcd.setCursor(1,0);
            myLcd.write(entry.parameters.line2);
            
            console.log('writing LCD');
        }
        if (entry.name == 'setColorRGB'){
            var rgb = entry.parameters.colorRGB;
            myLcd.setColor(rgb.red, rgb.green, rgb.blue);
            console.log('coloring LCD');
        }
    })


});

