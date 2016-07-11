// 974ef7ca1efb40ee93fec5b88f623341 device ID
// 56b9371a1a2341b18952ac40526ea469 device token
// https://api.artik.cloud/v1.1

//this code is from Samsung's blog: https://blog.samsungsami.io

var sami = "https://api.artik.cloud/v1.1/messages";
var bearer = "Bearer 3dbe7dca11e14f5682e4f986a9647c83";
var sdid = "6adba2ccc72e4e8190b553618ace81a0";

var Client = require("node-rest-client").Client;
var c = new Client();

function build_args (line1, line2 ,ts) {

	var args = {
		headers: {
			"Content-Type": "application/json",
			"Authorization": bearer 
		},  
		data: {
			"ddid": "6adba2ccc72e4e8190b553618ace81a0",
			"ts": 1388179812427,
			"type": "action",
			"data": {
				"actions": [
					{
						"name": "clean",
						"parameters": {}
					},
					{
						"name": "setText",
						"parameters": {
							"line1": line1,
							"line2": line2
						}
					},
					{
						"name": "setColorRGB",
						"parameters": {
							"colorRGB": {
								"red": 17,
								"green": 127,
								"blue": 255
							}
						}
					}
				]
			}
		}
	};
	return args;
}


function loop(){
    
		var args = build_args("Hello","NodeJS", new Date().valueOf());

		c.post(sami, args, function(data, response) {            
			console.log(data);
        	});	    
}

loop();