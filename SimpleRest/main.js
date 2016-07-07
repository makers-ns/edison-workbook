// Load Grove module
var mraa = require('mraa');
var LCD = require('jsupm_i2clcd');

// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var jsonParser = bodyParser.json();

app.set('port', 3000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', function (req, res) {
  res.send('Hello World from Makers.io');
});

app.get('/ar/:id', function (req, resApp) {

    var pin = req.params.id;

    var analogPin0 = new mraa.Aio(parseInt(pin)); //setup access analog inpuput pin 0
    var analogValue = analogPin0.read(); //read the value of the analog pin
    var analogValueFloat = analogPin0.readFloat(); //read the pin value as a float    
    
    resApp.type('application/json');          
    resApp.send('{"result":"' + analogValueFloat.toFixed(4) + '"}');
    
});

app.post('/dw/:id/:state', function (req, resApp) {

    var pin = req.params.id;
    var state = req.params.state;  // 0 or 1
    console.log(pin,state);
    var pinBoard = new mraa.Gpio(parseInt(pin));
    
    pinBoard.dir(mraa.DIR_OUT);
    pinBoard.write(1);
    pinBoard.write(parseInt(state));
    
    resApp.type('application/json');          
    resApp.send('{"result":"OK"}');
    
});

app.post('/dw/json',jsonParser, function (req, resApp) {

    var data = req.body;
    var pin = data.pin;
    var state = data.state;  // 0 or 1
    console.log(pin,state);
    var pinBoard = new mraa.Gpio(parseInt(pin));
    
    pinBoard.dir(mraa.DIR_OUT);
    pinBoard.write(1);
    pinBoard.write(parseInt(state));
    
    resApp.type('application/json');          
    resApp.send('{"result":"OK"}');    
    
});

app.post('/lcd',jsonParser, function (req, resApp) {

    var data = req.body;
    var row1Text = data.row1;
    var row2Text = data.row2;

    myLcd.clear();
    myLcd.setCursor(0,0);
    myLcd.write(row1Text);
    myLcd.setCursor(1,0);
    myLcd.write(row2Text);
    
    resApp.type('application/json');          
    resApp.send('{"result":"OK"}');    
    
});



myLcd.setCursor(0,0);
// RGB Blue
myLcd.setColor(53, 39, 249);
myLcd.write('Edison REST');  
myLcd.setCursor(1,2);
myLcd.write('Hello World');