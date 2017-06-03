var express = require('express');
var router = express.Router();
var fs = require('fs');
var Configuration = {};
var events = require('events');
var eventEmitt = new events.EventEmitter();
var request = require('request');
//var xml2js = require('xml2js');
//var parser = new xml2js.Parser();
var querystring = require('querystring');
var qs = require('qs');
var Client = require('node-rest-client').Client;
var client = new Client();
var http = require("http");
var Rob8;
var Res_obj;
var myarr = [];
var KPIs = {
    Availability: [{
        ROB1_Availability: 0
    }, {
        ROB2_Availability: 0
    }, {
        ROB3_Availability: 0
    }, {
        ROB4_Availability: 0
    }, {
        ROB5_Availability: 0
    }, {
        ROB6_Availability: 0
    }, {
        ROB7_Availability: 0
    }, {
        ROB8_Availability: 0
    }, {
        ROB9_Availability: 0
    }, {
        ROB10_Availability: 0
    }, {
        ROB11_Availability: 0
    }, {
        ROB12_Availability: 0
    }],
    SetupRate: {}
};
var KpiValues;



/******************************************GET Data from the DATA Set Function(Sending GET Request to Fuseki Server)****************************/
function getData(i) {

var rob_number = "ROB" + i + "_Availability";
 	var getQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>SELECT ?s ?p ?time { [] test:Kpi_Variable ?s; test:hasValue_ROB" + i + " ?p; test:hasTime ?time. FILTER(?s= test:Actual_Production_Time) } order by ?time";
 	var myquery1 = qs.stringify({
 		query: getQuery
 	});
 
 	request.get('http://localhost:3030/DS-1/sparql?' + myquery1 + '&format=json', function(error, response, body) {
 		if (!error && response.statusCode == 200) {

 				var parseit = JSON.parse(body);
 			var Blength = parseit.results.bindings.length;
 			var Total_time_ROB = 0;
 			myarr = new Array();
 			for (var j = 0; j < Blength; j++) {
 				var time_parsed = parseFloat(parseit.results.bindings[j].p.value)
 				myarr.push(time_parsed);
 				Total_time_ROB = time_parsed + Total_time_ROB;
 			}

 		
 			var TTR= parseFloat(((Total_time_ROB / 600) * 100).toFixed(2));
 			KPIs["Availability"][i-1][rob_number] = TTR;
                  
 			i++;
 			if (i < 13) {
 				getData(i);
 			}
 		}
 		else {

 			if (i < 12) {
 				i++;
 				getData(i);
 			}
			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
} //getData End

/******************************************Update Data Set Function(Sending POST Request to Fuseki Server)****************************/
function updateDS(secs, ws_number) {
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?s; test:hasValue_ROB" + ws_number + "?p; test:hasTime ?now.} where {values (?s ?p ) {(test:Actual_Production_Time " + secs + ")} bind (now() as ?now)}";

	var myquery2 = qs.stringify({
		update: updateQuery
	});

	request.post({
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		url: 'http://localhost:3030/DS-1/?' + myquery2
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('successful update');
			//console.log(body);
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
} //updateDS End

/**************************************** Recieves Post Notification from Simulator whenever something changes on the simulator*****************************************/
router.post('/data', function(req, res) {
	res.end();
	console.log(req.body);
	var notif = req.body;

	/********************************* When Conveyor Start Transferring *****************************************/
	if (notif.Msg == 'ConveyorStartTransferring') {

		if (notif.WS == '1') {


		}
		if (notif.WS == '2') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '3') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '4') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '5') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '6') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}

		if (notif.WS == '7') {


		}
		if (notif.WS == '8') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {
				currentTime = new Date(),
					hours = currentTime.getHours(),
					minutes = currentTime.getMinutes(),
					sec = currentTime.getSeconds(),
					msec = currentTime.getMilliseconds();
				if (minutes < 10) {
					minutes = "0" + minutes;
				}

				console.log(hours + ":" + minutes + ":" + sec + ":" + msec);
			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '9') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '10') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '11') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '12') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}

	}
	/********************************* When Conveyor Stop Transferring *****************************************/

	if (notif.Msg == 'ConveyorStopTransferring') {

		if (notif.WS == '1') {


		}
		if (notif.WS == '2') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '3') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '4') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '5') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '6') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}

		if (notif.WS == '7') {


		}
		if (notif.WS == '8') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {
				currentTime8f = new Date(),
					hours8f = currentTime8f.getHours(),
					minutes8f = currentTime8f.getMinutes(),
					sec8f = currentTime8f.getSeconds(),
					msec8f = currentTime8f.getMilliseconds();


				ss = sec8f - sec;
				msd = msec8f - msec;
				console.log('seconds ' + ss);
				console.log('mseconds ' + msd);
				console.log(hours8f + ":" + minutes8f + ":" + sec8f + ":" + msec8f);
			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '9') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '10') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '11') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}
		if (notif.WS == '12') {
			if ((notif.From == '1' || notif.From == '2' || notif.From == '3') && (notif.To == '2' || notif.To == '3' || notif.To == '5')) {

			} else if ((notif.From == '1' || notif.From == '1') && (notif.To == '4' || notif.To == '5')) {


			}
		}

	}

	/******************************Paper Loading and Unloading Notifications********************************/
	if (notif.MSG == 'RobotStartLoading' || notif.Msg == 'RobotStartUnloading') {

		ROB1_StartTime = new Date(),
			ROB1_StartHours = ROB1_StartTime.getHours(),
			ROB1_StartMinutes = ROB1_StartTime.getMinutes(),
			ROB1_StartSeconds = ROB1_StartTime.getSeconds(),
			ROB1_StartMilliseconds = ROB1_StartTime.getMilliseconds();

		ROB1_StartHours = ROB1_StartHours * 60 * 60;
		ROB1_StartMinutes = ROB1_StartMinutes * 60;
		ROB1_StartMilliseconds = ROB1_StartMilliseconds / 1000;
		ROB1_StartSeconds = ROB1_StartSeconds + ROB1_StartMilliseconds + ROB1_StartMinutes + ROB1_StartHours;

		console.log("Start seconds: "+ ROB1_StartSeconds);


	}
	if (notif.MSG == 'PaperLoaded' || notif.MSG == 'PaperUnloaded') {
		ROB1_StopTime = new Date(),
			ROB1_StopHours = ROB1_StopTime.getHours(),
			ROB1_StopMinutes = ROB1_StopTime.getMinutes(),
			ROB1_StopSeconds = ROB1_StopTime.getSeconds(),
			ROB1_StopMilliseconds = ROB1_StopTime.getMilliseconds();

		ROB1_StopHours = ROB1_StopHours * 60 * 60;
		ROB1_StopMinutes = ROB1_StopMinutes * 60;
		ROB1_StopMilliseconds = ROB1_StopMilliseconds / 1000;
		ROB1_StopSeconds = ROB1_StopSeconds + ROB1_StopMilliseconds + ROB1_StopMinutes + ROB1_StopHours;
		console.log("ROB1_StartSeconds "+ROB1_StartSeconds);
		console.log("ROB1_StopSeconds " +ROB1_StopSeconds);
		var ROB1_Total_Seconds = ROB1_StopSeconds - ROB1_StartSeconds;
		console.log("ROB1_Total_Seconds "+ROB1_Total_Seconds);
		updateDS(ROB1_Total_Seconds, notif.WS);


	}
	
	/************************* When Robot Start drawing**************************/
	if (notif.MSG == 'RobotStartDrawing') {

		if (notif.WS == '2') {
			ROB2_StartTime = new Date(),
				ROB2_StartHours = ROB2_StartTime.getHours(),
				ROB2_StartMinutes = ROB2_StartTime.getMinutes(),
				ROB2_StartSeconds = ROB2_StartTime.getSeconds(),
				ROB2_StartMilliseconds = ROB2_StartTime.getMilliseconds();

			ROB2_StartHours = ROB2_StartHours * 60 * 60;
			ROB2_StartMinutes = ROB2_StartMinutes * 60;
			ROB2_StartMilliseconds = ROB2_StartMilliseconds / 1000;
			ROB2_StartSeconds = ROB2_StartSeconds + ROB2_StartMilliseconds + ROB2_StartMinutes + ROB2_StartHours;

			console.log(ROB2_StartSeconds);

		}
		if (notif.WS == '3') {
			ROB3_StartTime = new Date(),
				ROB3_StartHours = ROB3_StartTime.getHours(),
				ROB3_StartMinutes = ROB3_StartTime.getMinutes(),
				ROB3_StartSeconds = ROB3_StartTime.getSeconds(),
				ROB3_StartMilliseconds = ROB3_StartTime.getMilliseconds();

			ROB3_StartHours = ROB3_StartHours * 60 * 60;
			ROB3_StartMinutes = ROB3_StartMinutes * 60;
			ROB3_StartMilliseconds = ROB3_StartMilliseconds / 1000;
			ROB3_StartSeconds = ROB3_StartSeconds + ROB3_StartMilliseconds + ROB3_StartMinutes + ROB3_StartHours;

			console.log(ROB3_StartSeconds);

		}
		if (notif.WS == '4') {
			ROB4_StartTime = new Date(),
				ROB4_StartHours = ROB4_StartTime.getHours(),
				ROB4_StartMinutes = ROB4_StartTime.getMinutes(),
				ROB4_StartSeconds = ROB4_StartTime.getSeconds(),
				ROB4_StartMilliseconds = ROB4_StartTime.getMilliseconds();

			ROB4_StartHours = ROB4_StartHours * 60 * 60;
			ROB4_StartMinutes = ROB4_StartMinutes * 60;
			ROB4_StartMilliseconds = ROB4_StartMilliseconds / 1000;
			ROB4_StartSeconds = ROB4_StartSeconds + ROB4_StartMilliseconds + ROB4_StartMinutes + ROB4_StartHours;

			console.log(ROB4_StartSeconds);

		}
		if (notif.WS == '5') {

			ROB5_StartTime = new Date(),
				ROB5_StartHours = ROB5_StartTime.getHours(),
				ROB5_StartMinutes = ROB5_StartTime.getMinutes(),
				ROB5_StartSeconds = ROB5_StartTime.getSeconds(),
				ROB5_StartMilliseconds = ROB5_StartTime.getMilliseconds();

			ROB5_StartHours = ROB5_StartHours * 60 * 60;
			ROB5_StartMinutes = ROB5_StartMinutes * 60;
			ROB5_StartMilliseconds = ROB5_StartMilliseconds / 1000;
			ROB5_StartSeconds = ROB5_StartSeconds + ROB5_StartMilliseconds + ROB5_StartMinutes + ROB5_StartHours;

			console.log(ROB5_StartSeconds);


		}
		if (notif.WS == '6') {
			ROB6_StartTime = new Date(),
				ROB6_StartHours = ROB6_StartTime.getHours(),
				ROB6_StartMinutes = ROB6_StartTime.getMinutes(),
				ROB6_StartSeconds = ROB6_StartTime.getSeconds(),
				ROB6_StartMilliseconds = ROB6_StartTime.getMilliseconds();

			ROB6_StartHours = ROB6_StartHours * 60 * 60;
			ROB6_StartMinutes = ROB6_StartMinutes * 60;
			ROB6_StartMilliseconds = ROB6_StartMilliseconds / 1000;
			ROB6_StartSeconds = ROB6_StartSeconds + ROB6_StartMilliseconds + ROB6_StartMinutes + ROB6_StartHours;

			console.log(ROB6_StartSeconds);


		}
		if (notif.WS == '8') {
			ROB8_StartTime = new Date(),
				ROB8_StartHours = ROB8_StartTime.getHours(),
				ROB8_StartMinutes = ROB8_StartTime.getMinutes(),
				ROB8_StartSeconds = ROB8_StartTime.getSeconds(),
				ROB8_StartMilliseconds = ROB8_StartTime.getMilliseconds();

			ROB8_StartHours = ROB8_StartHours * 60 * 60;
			ROB8_StartMinutes = ROB8_StartMinutes * 60;
			ROB8_StartMilliseconds = ROB8_StartMilliseconds / 1000;
			ROB8_StartSeconds = ROB8_StartSeconds + ROB8_StartMilliseconds + ROB8_StartMinutes + ROB8_StartHours;

			console.log(ROB8_StartSeconds);

		}
		if (notif.WS == '9') {
			ROB9_StartTime = new Date(),
				ROB9_StartHours = ROB9_StartTime.getHours(),
				ROB9_StartMinutes = ROB9_StartTime.getMinutes(),
				ROB9_StartSeconds = ROB9_StartTime.getSeconds(),
				ROB9_StartMilliseconds = ROB9_StartTime.getMilliseconds();

			ROB9_StartHours = ROB9_StartHours * 60 * 60;
			ROB9_StartMinutes = ROB9_StartMinutes * 60;
			ROB9_StartMilliseconds = ROB9_StartMilliseconds / 1000;
			ROB9_StartSeconds = ROB9_StartSeconds + ROB9_StartMilliseconds + ROB9_StartMinutes + ROB9_StartHours;

			console.log(ROB9_StartSeconds);

		}
		if (notif.WS == '10') {
			ROB10_StartTime = new Date(),
				ROB10_StartHours = ROB10_StartTime.getHours(),
				ROB10_StartMinutes = ROB10_StartTime.getMinutes(),
				ROB10_StartSeconds = ROB10_StartTime.getSeconds(),
				ROB10_StartMilliseconds = ROB10_StartTime.getMilliseconds();

			ROB10_StartHours = ROB10_StartHours * 60 * 60;
			ROB10_StartMinutes = ROB10_StartMinutes * 60;
			ROB10_StartMilliseconds = ROB10_StartMilliseconds / 1000;
			ROB10_StartSeconds = ROB10_StartSeconds + ROB10_StartMilliseconds + ROB10_StartMinutes + ROB10_StartHours;

			console.log(ROB10_StartSeconds);

		}
		if (notif.WS == '11') {
			ROB11_StartTime = new Date(),
				ROB11_StartHours = ROB11_StartTime.getHours(),
				ROB11_StartMinutes = ROB11_StartTime.getMinutes(),
				ROB11_StartSeconds = ROB11_StartTime.getSeconds(),
				ROB11_StartMilliseconds = ROB11_StartTime.getMilliseconds();

			ROB11_StartHours = ROB11_StartHours * 60 * 60;
			ROB11_StartMinutes = ROB11_StartMinutes * 60;
			ROB11_StartMilliseconds = ROB11_StartMilliseconds / 1000;
			ROB11_StartSeconds = ROB11_StartSeconds + ROB11_StartMilliseconds + ROB11_StartMinutes + ROB11_StartHours;

			console.log(ROB11_StartSeconds);

		}
		if (notif.WS == '12') {
			ROB12_StartTime = new Date(),
				ROB12_StartHours = ROB12_StartTime.getHours(),
				ROB12_StartMinutes = ROB12_StartTime.getMinutes(),
				ROB12_StartSeconds = ROB12_StartTime.getSeconds(),
				ROB12_StartMilliseconds = ROB12_StartTime.getMilliseconds();

			ROB12_StartHours = ROB12_StartHours * 60 * 60;
			ROB12_StartMinutes = ROB12_StartMinutes * 60;
			ROB12_StartMilliseconds = ROB12_StartMilliseconds / 1000;
			ROB12_StartSeconds = ROB12_StartSeconds + ROB12_StartMilliseconds + ROB12_StartMinutes + ROB12_StartHours;

			console.log(ROB12_StartSeconds);

		}
	}


	/************************* When Robot Stop drawing**************************/

	if (notif.MSG == 'RobotStopDrawing') {
		if (notif.WS == '2') {
			ROB2_StopTime = new Date(),
				ROB2_StopHours = ROB2_StopTime.getHours(),
				ROB2_StopMinutes = ROB2_StopTime.getMinutes(),
				ROB2_StopSeconds = ROB2_StopTime.getSeconds(),
				ROB2_StopMilliseconds = ROB2_StopTime.getMilliseconds();

			ROB2_StopHours = ROB2_StopHours * 60 * 60;
			ROB2_StopMinutes = ROB2_StopMinutes * 60;
			ROB2_StopMilliseconds = ROB2_StopMilliseconds / 1000;
			ROB2_StopSeconds = ROB2_StopSeconds + ROB2_StopMilliseconds + ROB2_StopMinutes + ROB2_StopHours;
			console.log(ROB2_StartSeconds);
			console.log(ROB2_StopSeconds);
			var ROB2_Total_Seconds = ROB2_StopSeconds - ROB2_StartSeconds;
			console.log(ROB2_Total_Seconds);
			updateDS(ROB2_Total_Seconds, notif.WS);

		}
		if (notif.WS == '3') {
			ROB3_StopTime = new Date(),
				ROB3_StopHours = ROB3_StopTime.getHours(),
				ROB3_StopMinutes = ROB3_StopTime.getMinutes(),
				ROB3_StopSeconds = ROB3_StopTime.getSeconds(),
				ROB3_StopMilliseconds = ROB3_StopTime.getMilliseconds();

			ROB3_StopHours = ROB3_StopHours * 60 * 60;
			ROB3_StopMinutes = ROB3_StopMinutes * 60;
			ROB3_StopMilliseconds = ROB3_StopMilliseconds / 1000;
			ROB3_StopSeconds = ROB3_StopSeconds + ROB3_StopMilliseconds + ROB3_StopMinutes + ROB3_StopHours;
			console.log(ROB3_StartSeconds);
			console.log(ROB3_StopSeconds);
			var ROB3_Total_Seconds = ROB3_StopSeconds - ROB3_StartSeconds;
			console.log(ROB3_Total_Seconds);
			updateDS(ROB3_Total_Seconds, notif.WS);

		}
		if (notif.WS == '4') {
			ROB4_StopTime = new Date(),
				ROB4_StopHours = ROB4_StopTime.getHours(),
				ROB4_StopMinutes = ROB4_StopTime.getMinutes(),
				ROB4_StopSeconds = ROB4_StopTime.getSeconds(),
				ROB4_StopMilliseconds = ROB4_StopTime.getMilliseconds();

			ROB4_StopHours = ROB4_StopHours * 60 * 60;
			ROB4_StopMinutes = ROB4_StopMinutes * 60;
			ROB4_StopMilliseconds = ROB4_StopMilliseconds / 1000;
			ROB4_StopSeconds = ROB4_StopSeconds + ROB4_StopMilliseconds + ROB4_StopMinutes + ROB4_StopHours;
			console.log(ROB4_StartSeconds);
			console.log(ROB4_StopSeconds);
			var ROB4_Total_Seconds = ROB4_StopSeconds - ROB4_StartSeconds;
			console.log(ROB4_Total_Seconds);
			updateDS(ROB4_Total_Seconds, notif.WS);

		}
		if (notif.WS == '5') {
			ROB5_StopTime = new Date(),
				ROB5_StopHours = ROB5_StopTime.getHours(),
				ROB5_StopMinutes = ROB5_StopTime.getMinutes(),
				ROB5_StopSeconds = ROB5_StopTime.getSeconds(),
				ROB5_StopMilliseconds = ROB5_StopTime.getMilliseconds();

			ROB5_StopHours = ROB5_StopHours * 60 * 60;
			ROB5_StopMinutes = ROB5_StopMinutes * 60;
			ROB5_StopMilliseconds = ROB5_StopMilliseconds / 1000;
			ROB5_StopSeconds = ROB5_StopSeconds + ROB5_StopMilliseconds + ROB5_StopMinutes + ROB5_StopHours;
			console.log(ROB5_StartSeconds);
			console.log(ROB5_StopSeconds);
			var ROB5_Total_Seconds = ROB5_StopSeconds - ROB5_StartSeconds;
			console.log(ROB5_Total_Seconds);
			updateDS(ROB5_Total_Seconds, notif.WS);
		}
		if (notif.WS == '6') {
			ROB6_StopTime = new Date(),
				ROB6_StopHours = ROB6_StopTime.getHours(),
				ROB6_StopMinutes = ROB6_StopTime.getMinutes(),
				ROB6_StopSeconds = ROB6_StopTime.getSeconds(),
				ROB6_StopMilliseconds = ROB6_StopTime.getMilliseconds();

			ROB6_StopHours = ROB6_StopHours * 60 * 60;
			ROB6_StopMinutes = ROB6_StopMinutes * 60;
			ROB6_StopMilliseconds = ROB6_StopMilliseconds / 1000;
			ROB6_StopSeconds = ROB6_StopSeconds + ROB6_StopMilliseconds + ROB6_StopMinutes + ROB6_StopHours;
			console.log(ROB6_StartSeconds);
			console.log(ROB6_StopSeconds);
			var ROB6_Total_Seconds = ROB6_StopSeconds - ROB6_StartSeconds;
			console.log(ROB6_Total_Seconds);
			updateDS(ROB6_Total_Seconds, notif.WS);

		}
		if (notif.WS == '8') {
			ROB8_StopTime = new Date(),
				ROB8_StopHours = ROB8_StopTime.getHours(),
				ROB8_StopMinutes = ROB8_StopTime.getMinutes(),
				ROB8_StopSeconds = ROB8_StopTime.getSeconds(),
				ROB8_StopMilliseconds = ROB8_StopTime.getMilliseconds();

			ROB8_StopHours = ROB8_StopHours * 60 * 60;
			ROB8_StopMinutes = ROB8_StopMinutes * 60;
			ROB8_StopMilliseconds = ROB8_StopMilliseconds / 1000;
			ROB8_StopSeconds = ROB8_StopSeconds + ROB8_StopMilliseconds + ROB8_StopMinutes + ROB8_StopHours;
			console.log(ROB8_StartSeconds);
			console.log(ROB8_StopSeconds);
			var ROB8_Total_Seconds = ROB8_StopSeconds - ROB8_StartSeconds;
			console.log(ROB8_Total_Seconds);
			updateDS(ROB8_Total_Seconds, notif.WS);
		}

		if (notif.WS == '9') {
			ROB9_StopTime = new Date(),
				ROB9_StopHours = ROB9_StopTime.getHours(),
				ROB9_StopMinutes = ROB9_StopTime.getMinutes(),
				ROB9_StopSeconds = ROB9_StopTime.getSeconds(),
				ROB9_StopMilliseconds = ROB9_StopTime.getMilliseconds();

			ROB9_StopHours = ROB9_StopHours * 60 * 60;
			ROB9_StopMinutes = ROB9_StopMinutes * 60;
			ROB9_StopMilliseconds = ROB9_StopMilliseconds / 1000;
			ROB9_StopSeconds = ROB9_StopSeconds + ROB9_StopMilliseconds + ROB9_StopMinutes + ROB9_StopHours;
			console.log(ROB9_StartSeconds);
			console.log(ROB9_StopSeconds);
			var ROB9_Total_Seconds = ROB9_StopSeconds - ROB9_StartSeconds;
			console.log(ROB9_Total_Seconds);
			updateDS(ROB9_Total_Seconds, notif.WS);

		}
		if (notif.WS == '10') {
			ROB10_StopTime = new Date(),
				ROB10_StopHours = ROB10_StopTime.getHours(),
				ROB10_StopMinutes = ROB10_StopTime.getMinutes(),
				ROB10_StopSeconds = ROB10_StopTime.getSeconds(),
				ROB10_StopMilliseconds = ROB10_StopTime.getMilliseconds();

			ROB10_StopHours = ROB10_StopHours * 60 * 60;
			ROB10_StopMinutes = ROB10_StopMinutes * 60;
			ROB10_StopMilliseconds = ROB10_StopMilliseconds / 1000;
			ROB10_StopSeconds = ROB10_StopSeconds + ROB10_StopMilliseconds + ROB10_StopMinutes + ROB10_StopHours;
			console.log(ROB10_StartSeconds);
			console.log(ROB10_StopSeconds);
			var ROB10_Total_Seconds = ROB10_StopSeconds - ROB10_StartSeconds;
			console.log(ROB10_Total_Seconds);
			updateDS(ROB10_Total_Seconds, notif.WS);


		}
		if (notif.WS == '11') {
			ROB11_StopTime = new Date(),
				ROB11_StopHours = ROB11_StopTime.getHours(),
				ROB11_StopMinutes = ROB11_StopTime.getMinutes(),
				ROB11_StopSeconds = ROB11_StopTime.getSeconds(),
				ROB11_StopMilliseconds = ROB11_StopTime.getMilliseconds();

			ROB11_StopHours = ROB11_StopHours * 60 * 60;
			ROB11_StopMinutes = ROB11_StopMinutes * 60;
			ROB11_StopMilliseconds = ROB11_StopMilliseconds / 1000;
			ROB11_StopSeconds = ROB11_StopSeconds + ROB11_StopMilliseconds + ROB11_StopMinutes + ROB11_StopHours;
			console.log(ROB11_StartSeconds);
			console.log(ROB11_StopSeconds);
			var ROB11_Total_Seconds = ROB11_StopSeconds - ROB11_StartSeconds;
			console.log(ROB11_Total_Seconds);
			updateDS(ROB11_Total_Seconds, notif.WS);


		}
		if (notif.WS == '12') {
			ROB12_StopTime = new Date(),
				ROB12_StopHours = ROB12_StopTime.getHours(),
				ROB12_StopMinutes = ROB12_StopTime.getMinutes(),
				ROB12_StopSeconds = ROB12_StopTime.getSeconds(),
				ROB12_StopMilliseconds = ROB12_StopTime.getMilliseconds();

			ROB12_StopHours = ROB12_StopHours * 60 * 60;
			ROB12_StopMinutes = ROB12_StopMinutes * 60;
			ROB12_StopMilliseconds = ROB12_StopMilliseconds / 1000;
			ROB12_StopSeconds = ROB12_StopSeconds + ROB12_StopMilliseconds + ROB12_StopMinutes + ROB12_StopHours;
			console.log(ROB12_StartSeconds);
			console.log(ROB12_StopSeconds);
			var ROB12_Total_Seconds = ROB12_StopSeconds - ROB12_StartSeconds;
			console.log(ROB12_Total_Seconds);
			updateDS(ROB12_Total_Seconds, notif.WS);


		}
	}



}); //router.post End



var io;
fs.readFile('public/Configuration.json', 'utf8', function(err, data) {
	Configuration = JSON.parse(data);
	eventEmitt.emit('Intialization');
});
eventEmitt.on('Intialization', function() {

	var app = express();
	var http = require('http');
	app.set('port', Configuration.SocketPort3);
	var server = http.createServer(app);
	server.listen(Configuration.SocketPort3);
	io = require('socket.io')(server);

	setInterval(function() {
		getData(1);

	}, 250);

	setInterval(function() {
		io.emit('test', KPIs);
	}, 100);
});



router.get('/', function(req, res, next) {
	//console.log(req);
	res.render('Kpi', {
		title: 'KPIs',
		Host: Configuration.Host,
		Port: Configuration.Port,
		SocketPort1: Configuration.SocketPort1,
		SocketPort3: Configuration.SocketPort3,
		HostName: Configuration.Host + ':' + Configuration.Port
	});

});

module.exports = router;