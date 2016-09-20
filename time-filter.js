module.exports = function(RED) {
	"use strict";
	var path = require('path');
	var req = require('request');

	var timeFilter = function(n) {
		RED.nodes.createNode(this,n);
		this.events = JSON.parse(n.events);
		this.central = n.central;
		this.topic = n.topic;
		this.startPayload = n.startPayload;
		this.startPayloadType = n.startPayloadType;
		this.endPayload = n.endPayload;
		this.endPayloadType = n.endPayloadType;
		var node = this;

		function checkCentral() {
			if (node.central) {
				req(node.central, function(err, respose, body){
					if (!err && response.statusCode == 200) {
						try{
							node.events = JSON.parse(body);
						} catch (error) {
							//problem with the events returned
							node.log(error);
						}
					} else {
						node.log(err, response.statusCode);
					}
				});
			}
		}

		// function checkTime(){
		// 	var now = new Date();
		// 	var day = now.getUTCDay();
		// 	var hour = now.getUTCHours();
		// 	var mins = now.getUTCMinutes()
		// 	for (var i=0; i< node.events.length; i++) {
		// 		var evtStart = new Date();
		// 		evtStart.setTime(Date.parse(node.events[i].start));
		// 		var evtEnd =  new Date();
		// 		evtEnd.setTime(Date.parse(node.events[i].end));
		// 		// console.log("Now: ", now);
		// 		// console.log("Now hour: ", hour);
		// 		// console.log("Now mins: ", mins);
		// 		// console.log("Start: ",evtStart);
		// 		// console.log("Start hour: ",evtStart.getUTCHours());
		// 		// console.log("Start mins: ",evtStart.getUTCMinutes());
		// 		// console.log("End: ",evtEnd);

		// 		if (evtStart.getUTCDay() === day) { //same day of week
		// 			if (hour === evtStart.getUTCHours() && mins === evtStart.getUTCMinutes()) {
		// 				console.log("start");
		// 				var msg = {
		// 					topic: node.topic,
		// 					event: {
		// 						start:evtStart.toTimeString(),
		// 						end: evtEnd.toTimeString()
		// 					},
		// 					payload: RED.util.evaluateNodeProperty(node.startPayload, node.startPayloadType, node,msg)
		// 				};
		// 				node.send(msg);
		// 			}
		// 			if (hour === evtEnd.getUTCHours() && mins === evtEnd.getUTCMinutes()) {
		// 				console.log("end");
		// 				var msg = {
		// 					topic: node.topic,
		// 					event: {
		// 						start:evtStart.toTimeString(),
		// 						end: evtEnd.toTimeString()
		// 					},
		// 					payload: RED.util.evaluateNodeProperty(node.endPayload, node.endPayloadType, node,msg)
		// 				};
		// 				node.send(msg);
		// 			}
		// 		}
		// 	}
		// }

		node.on('input', function(msg){
			var now = new Date();
			var day = now.getUTCDay();
			var hour = now.getUTCHours();
			var mins = now.getUTCMinutes();
			for (var i=0; i< node.events.length; i++) {
				var evtStart = new Date();
				evtStart.setTime(Date.parse(node.events[i].start));
				var evtEnd =  new Date();
				evtEnd.setTime(Date.parse(node.events[i].end));
				// console.log("Now: ", now);
				// console.log("Now hour: ", hour);
				// console.log("Now mins: ", mins);
				// console.log("Start: ",evtStart);
				// console.log("Start hour: ",evtStart.getUTCHours());
				// console.log("Start mins: ",evtStart.getUTCMinutes());
				// console.log("End: ",evtEnd);

				if (evtStart.getUTCDay() === day) { //same day of week

					var start = ((evtStart.getUTCHours() * 60) + evtStart.getUTCMinutes());
					var end = ((evtEnd.getUTCHours() * 60) + evtEnd.getUTCMinutes());
					var test = ((hour * 60) + mins);

					if (test >= start &&  test <= end) {
						node.send(msg);
					}
				}
			}

		});

		node.centralInterval = setInterval(checkCentral,600000); //once every 10mins

		//node.interval = setInterval(checkTime,60000); //once a min
		//checkTime();

		node.on('close', function(){
			clearInterval(node.centralInterval);
			//clearInterval(node.interval);
		});

	};
	RED.nodes.registerType("time-filter",timeFilter);

	// RED.httpAdmin.get('/time-planner/js/*', function(req,res){
	// 	// var filename = path.join(__dirname , 'static', req.params[0]);
	// 	// res.sendfile(filename);
	// 	var options = {
	// 		root: __dirname + '/static/',
	// 		dotfiles: 'deny'
	// 	};
 // 		res.sendFile(req.params[0], options);
	// });
};