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
var view_arr=[];
var	kpiView=[];
var str;
var newvar1 =[];
var KpiList=[];
var NewVariable={};
var UpdateFrontEnd = require('./UpdateFrontEnd');
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
//var KPIsNew={Availability:[]};
var KPIsNew={};

var KpiValues;


 function getKpiList() {

 	var KpiGet = 'PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> Select * where{ ?kpi test:hasVariable ?variable}';
 	var KpiQuery = qs.stringify({
 		query: KpiGet
 	});

 	request.get('http://localhost:3030/DS-1/sparql?' + KpiQuery + '&format=json', function(error, response, body) {
 		if (!error && response.statusCode == 200) {
				//console.log(body);
 				var parseit = JSON.parse(body);
				var bindings = parseit.results.bindings;
				var count = 0;
				var finalArray = [];
				bindings.forEach(function(kpiinitial, currindex){
					delete kpiinitial.kpi.type;
					delete kpiinitial.variable.type;
					kpiinitial.kpi.value = kpiinitial.kpi.value.split("#")[1];
					kpiinitial.variable.value = kpiinitial.variable.value.split("#")[1];
					
					kpiinitial.kpi[kpiinitial.kpi.value] =  [kpiinitial.variable.value];
					
					var index = bindings.map(function(d) { return d['kpi']['value']; }).indexOf(kpiinitial.kpi.value)
					if(index > -1 && count !== index){
					bindings[index].kpi[kpiinitial.kpi.value].push(kpiinitial.variable.value);
					//console.log("here is the current index: "+currindex);
					}
					
					var index_new = finalArray.map(function(d) { return d['kpi']['value']; }).indexOf(kpiinitial.kpi.value);
					if (index_new < 0)
							finalArray.push(kpiinitial);
						KPIsNew[kpiinitial.kpi.value]=[];
					count++;
					delete kpiinitial.variable;
					});
					
				var str = JSON.stringify(finalArray, null, 2);
				console.log(str);
				KpiList=str;
				
				console.log('KPi List************************');
				console.log(KpiList);
				
				console.log('KPi List************************');
				console.log(KPIsNew);
			
			
 		}
 		else {

			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
}   


function getVariableList() {

 	var VariableGet = 'PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> PREFIX owl:<http://www.w3.org/2002/07/owl#> Select Distinct ?KpiVariable ?property where{ ?z test:hasVariable ?x.?x ?p ?o . ?p a owl:DatatypeProperty bind(strafter(str(?z),"http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#") as ?kpi). bind(strafter(str(?x),"http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#") as ?KpiVariable). bind(strafter(str(?p),"http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#") as ?property)}';
 	var VariableQuery = qs.stringify({
 		query: VariableGet
 	});
 
 	request.get('http://localhost:3030/DS-1/sparql?' + VariableQuery + '&format=json', function(error, response, body) {
 		if (!error && response.statusCode == 200) {
				 //console.log(body);
 				var parseVariable = JSON.parse(body);
				var bindingsVariable = parseVariable.results.bindings;
				var count1 = 0;
				var finalArray = [];
				bindingsVariable.forEach(function(kpiinitial, currindex){
					delete kpiinitial.KpiVariable.type;
					delete kpiinitial.property.type;
				/* 	kpiinitial.kpi.value = kpiinitial.kpi.value.split("#")[1];
					kpiinitial.variable.value = kpiinitial.variable.value.split("#")[1]; */
					
					kpiinitial.KpiVariable[kpiinitial.KpiVariable.value] =  [kpiinitial.property.value];
				
					var index = bindingsVariable.map(function(d) { return d['KpiVariable']['value']; }).indexOf(kpiinitial.KpiVariable.value)
					if(index > -1 && count1 !== index){
					bindingsVariable[index].KpiVariable[kpiinitial.KpiVariable.value].push(kpiinitial.property.value);
					//console.log("here is the current index: "+currindex);
					}
					
					var index_new = finalArray.map(function(d) { return d['KpiVariable']['value']; }).indexOf(kpiinitial.KpiVariable.value);
					if (index_new < 0)
							finalArray.push(kpiinitial);
					count1++;
					delete kpiinitial.property; 
					});
						//console.log(bindingsVariable);
				str = JSON.stringify(finalArray, null, 2);
				console.log(str);
				getNewdata(str);
				 
			
			
 		}
 		else {

			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
}  


 function evaluateformula(NewVariable,KpiList){
	 //console.log(KpiList);
	 KpiList = JSON.parse(KpiList);
	 var countr=0;
	 KpiList.forEach(function(kpilistelement){
	if (kpilistelement.kpi.value=='Availability')
	{
countr++;
	console.log('i am countr  '+countr);		
	NewVariable.Actual_Production_Time.forEach(function(equipment){	
	var key = Object.keys(equipment);
	var key1 = Object.keys(NewVariable.Total_PT[0])
	var TTR= parseFloat(((equipment[key[0]]/NewVariable.Total_PT[0][key1[0]]) * 100).toFixed(2));
	var newobject1 = {};
			newobject1[key[0]] = TTR;
	KPIsNew['Availability'].push(newobject1);
	
	 });
	}
					 
	 });	
};
		
		 








/******************************************GET Data from the DATA Set Function(Sending GET Request to Fuseki Server)****************************/
 function getInitialData(i) {

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
 				getInitialData(i);
 			}
			io.emit('test', KPIs);
 		}
 		else {

 			if (i < 12) {
 				i++;
 				getInitialData(i);
 			}
			//console.log(response.statusCode)
	 		//console.warn(error);
		}
 	});
}  //getData End
    
/***********************************************get data from fuseki server*****************************/
	
function getData(i)	{
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
			io.emit('test', KPIs);
                  
 		}
 		else {

			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
} 
	
	
 function getNewdata(inp){
		 console.log('my input to function');
		var inp = JSON.parse(inp)
		var itemsProcessed=0;
		var x= inp;
		x.forEach(function(variablelist){
			//console.log(variablelist);
			var newvar2 ={"name":variablelist.KpiVariable.value, "value":[]};
			NewVariable[variablelist.KpiVariable.value]=[];
			 (variablelist.KpiVariable[variablelist.KpiVariable.value]).forEach(function(propertylist){
				 
			var getQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>SELECT ?s ?p ?time { [] test:Kpi_Variable ?s; test:" + propertylist + " ?p; test:hasTime ?time. FILTER(?s= test:"+variablelist.KpiVariable.value+") } order by ?time";
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

 		
 			//var TTR= parseFloat(((Total_time_ROB / 600) * 100).toFixed(2));
			/* console.log(variablelist.KpiVariable.value);
			console.log(propertylist);
			console.log(Total_time_ROB); */
			//var newvar= {"name":variablelist, "value":[]};
			var newobject = {};
			newobject[propertylist] = Total_time_ROB;
			newvar2.value.push(newobject);
			NewVariable[variablelist.KpiVariable.value].push(newobject);
 			//KPIsNew.push({"name":propertylist, value:[]});
         
 			//ewvar1=newvar2;
	//console.log(newvar1);
 		}
 		else {

 	
			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
			
		});	 
		newvar1.push(newvar2);
		itemsProcessed++;
    if(itemsProcessed === x.length) {
		setTimeout(function(){ evaluateformula(NewVariable,KpiList); }, 1000);
		
	}
		});
	console.log('***********I am new var 2********************');
		console.log(newvar1);
		
		//console.log(KPIsNew);
		
	} 
	
	
	
	
function updateinitialsetpoint() {
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?s; test:hasValue ?p; test:hasTime ?now.} where {values (?s ?p ) {(test:Total_PT  600)} bind (now() as ?now)}";

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
} 	
	
	
	
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
			getData(ws_number);
			getNewdata(str);
			//console.log(body);
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
} //updateDS End


function deleteData(deleteEquipmentList){
	 var checkvalues = ["Robot", "Conveyor"];
	var ie;
	console.log("in function: ",deleteEquipmentList);
	deleteEquipmentList.forEach(function (equipment){
	checkvalues.forEach(function (value){
	console.log(value);
	if(equipment.match(value)){
		console.log("value is ", value);
		 ie=(parseInt(equipment.replace(value, "")));
		 console.log(ie);
		 var deleteQuery="PREFIX test: <http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> DELETE { ?b  test:Kpi_Variable ?s ; test:hasValue_ROB"+ie+" ?p ; test:hasTime ?t . } WHERE { ?b  test:Kpi_Variable ?s ; test:hasValue_ROB"+ie+" ?p ; test:hasTime ?t . FILTER (?t < now())FILTER (isBlank(?b))VALUES (?s) { (test:Actual_Production_Time)}}";
	
	
	var myquery3 = qs.stringify({
		update: deleteQuery
	});

	request.post({
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		url: 'http://localhost:3030/DS-1/?' + myquery3
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('successful update');
			//console.log(body);
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
		
	}
	});
	}); 
	
	
	
}





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

ROB1_StartSeconds=Date.now()/1000;
		console.log("Start seconds: "+ ROB1_StartSeconds);


	}
	if (notif.MSG == 'PaperLoaded' || notif.MSG == 'PaperUnloaded') {

		ROB1_StopSeconds=Date.now()/1000;
		console.log("ROB1_StartSeconds "+ROB1_StartSeconds);
		console.log("ROB1_StopSeconds " +ROB1_StopSeconds);
		var ROB1_Total_Seconds = ROB1_StopSeconds - ROB1_StartSeconds;
		console.log("ROB1_Total_Seconds "+ROB1_Total_Seconds);
		updateDS(ROB1_Total_Seconds, notif.WS);


	}
	
	/************************* When Robot Start drawing**************************/
	if (notif.MSG == 'RobotStartDrawing') {

		if (notif.WS == '2') {
			
ROB2_StartSeconds=Date.now()/1000;
			console.log(ROB2_StartSeconds);

		}
		if (notif.WS == '3') {
			ROB3_StartSeconds=Date.now()/1000;

			console.log(ROB3_StartSeconds);

		}
		if (notif.WS == '4') {
			ROB4_StartSeconds=Date.now()/1000;

			console.log(ROB4_StartSeconds);

		}
		if (notif.WS == '5') {

			ROB5_StartSeconds=Date.now()/1000;

			console.log(ROB5_StartSeconds);


		}
		if (notif.WS == '6') {
			ROB6_StartSeconds=Date.now()/1000;

			console.log(ROB6_StartSeconds);


		}
		if (notif.WS == '8') {
			ROB8_StartSeconds=Date.now()/1000;

			console.log(ROB8_StartSeconds);

		}
		if (notif.WS == '9') {
			ROB9_StartSeconds=Date.now()/1000;

			console.log(ROB9_StartSeconds);

		}
		if (notif.WS == '10') {
			ROB10_StartSeconds=Date.now()/1000;

			console.log(ROB10_StartSeconds);

		}
		if (notif.WS == '11') {
			ROB11_StartSeconds=Date.now()/1000;

			console.log(ROB11_StartSeconds);

		}
		if (notif.WS == '12') {
			ROB12_StartSeconds=Date.now()/1000;

			console.log(ROB12_StartSeconds);

		}
	}


	/************************* When Robot Stop drawing**************************/

	if (notif.MSG == 'RobotStopDrawing') {
		if (notif.WS == '2') {
			ROB2_StopSeconds=Date.now()/1000;
			console.log(ROB2_StartSeconds);
			console.log(ROB2_StopSeconds);
			var ROB2_Total_Seconds = ROB2_StopSeconds - ROB2_StartSeconds;
			console.log(ROB2_Total_Seconds);
			updateDS(ROB2_Total_Seconds, notif.WS);

		}
		if (notif.WS == '3') {
			ROB3_StopSeconds=Date.now()/1000;
			console.log(ROB3_StartSeconds);
			console.log(ROB3_StopSeconds);
			var ROB3_Total_Seconds = ROB3_StopSeconds - ROB3_StartSeconds;
			console.log(ROB3_Total_Seconds);
			updateDS(ROB3_Total_Seconds, notif.WS);

		}
		if (notif.WS == '4') {
			ROB4_StopSeconds=Date.now()/1000;
			console.log(ROB4_StartSeconds);
			console.log(ROB4_StopSeconds);
			var ROB4_Total_Seconds = ROB4_StopSeconds - ROB4_StartSeconds;
			console.log(ROB4_Total_Seconds);
			updateDS(ROB4_Total_Seconds, notif.WS);

		}
		if (notif.WS == '5') {
			ROB5_StopSeconds=Date.now()/1000;
			console.log(ROB5_StartSeconds);
			console.log(ROB5_StopSeconds);
			var ROB5_Total_Seconds = ROB5_StopSeconds - ROB5_StartSeconds;
			console.log(ROB5_Total_Seconds);
			updateDS(ROB5_Total_Seconds, notif.WS);
		}
		if (notif.WS == '6') {
			ROB6_StopSeconds=Date.now()/1000;
			console.log(ROB6_StartSeconds);
			console.log(ROB6_StopSeconds);
			var ROB6_Total_Seconds = ROB6_StopSeconds - ROB6_StartSeconds;
			console.log(ROB6_Total_Seconds);
			updateDS(ROB6_Total_Seconds, notif.WS);

		}
		if (notif.WS == '8') {
			ROB8_StopSeconds=Date.now()/1000;
			console.log(ROB8_StartSeconds);
			console.log(ROB8_StopSeconds);
			var ROB8_Total_Seconds = ROB8_StopSeconds - ROB8_StartSeconds;
			console.log(ROB8_Total_Seconds);
			updateDS(ROB8_Total_Seconds, notif.WS);
		}

		if (notif.WS == '9') {
			ROB9_StopSeconds=Date.now()/1000;
			console.log(ROB9_StartSeconds);
			console.log(ROB9_StopSeconds);
			var ROB9_Total_Seconds = ROB9_StopSeconds - ROB9_StartSeconds;
			console.log(ROB9_Total_Seconds);
			updateDS(ROB9_Total_Seconds, notif.WS);

		}
		if (notif.WS == '10') {
			ROB10_StopSeconds=Date.now()/1000;
			console.log(ROB10_StartSeconds);
			console.log(ROB10_StopSeconds);
			var ROB10_Total_Seconds = ROB10_StopSeconds - ROB10_StartSeconds;
			console.log(ROB10_Total_Seconds);
			updateDS(ROB10_Total_Seconds, notif.WS);


		}
		if (notif.WS == '11') {
			ROB11_StopSeconds=Date.now()/1000;
			console.log(ROB11_StartSeconds);
			console.log(ROB11_StopSeconds);
			var ROB11_Total_Seconds = ROB11_StopSeconds - ROB11_StartSeconds;
			console.log(ROB11_Total_Seconds);
			updateDS(ROB11_Total_Seconds, notif.WS);


		}
		if (notif.WS == '12') {
ROB12_StopSeconds=Date.now()/1000;
			console.log(ROB12_StartSeconds);
			console.log(ROB12_StopSeconds);
			var ROB12_Total_Seconds = ROB12_StopSeconds - ROB12_StartSeconds;
			console.log(ROB12_Total_Seconds);
			updateDS(ROB12_Total_Seconds, notif.WS);


		}
	}



}); //router.post End

router.post('/deleteData', function(req, res) {
	var deleteEquipmentList= req.body;
	console.log(deleteEquipmentList);
		deleteData(deleteEquipmentList);
		
});

router.get('/viewData',function(req, res) {
	console.log('Initial data');
	var viewQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> SELECT  ?KPIs ?equipments where {?KPIs test:isViewed ?equipments}";
 	var myquery5 = qs.stringify({
 		query: viewQuery
 	});
 
 	request.get('http://localhost:3030/DS-1/sparql?' + myquery5 + '&format=json', function(error, response, body) {
 		if (!error && response.statusCode == 200) {
//console.log(JSON.parse(body));
 				var viewjson = JSON.parse(body);
 			var viewlength = viewjson.results.bindings.length;
			var bindings = viewjson.results.bindings;
			var checkedequipmentList = [];
			bindings.forEach(function(kpiinitial){
				var stringjson = kpiinitial.KPIs.value;
			var res = stringjson.split("#");
			var	kpiView=  res.splice(1,2);
			console.log(kpiView);
			var newobject = {};
            newobject[kpiView[0]] = kpiinitial.equipments.value;
			checkedequipmentList.push(newobject);
			console.log(checkedequipmentList);
			});
 			//console.log(viewjson.results.bindings[0].KPIs);
			
			
		
 		
 			/* for (var j = 0; j < viewlength; j++) {
 				var viewelements = parseFloat(viewjson.results.bindings[j].p.value)
 				view_arr.push(viewelements);
				
 console.log(view_arr);
 			} */
			res.send(checkedequipmentList)

 		}
 		else {
	 		console.warn(error);
		}
 	});
	
});



router.post('/deleteView',function(req, res) {
	console.log(req.body);
	UpdateFrontEnd.deleteView(req.body.deleteXML, req.body.deleteEquipment);
	res.send("I will delete it");
	
		
});


router.post('/insertView',function(req, res) {
	var viewEquipmentList= req.body;
	console.log(viewEquipmentList);
	UpdateFrontEnd.updateView(req.body.xmlFileName, req.body.checkedequipment);
	res.send("I got it");
	
		
});
var io;
fs.readFile('public/Configuration.json', 'utf8', function(err, data) {
	Configuration = JSON.parse(data);
	eventEmitt.emit('Intialization');
});
eventEmitt.on('Intialization', function() {
	var counter =0;
	var app = express();
	var http = require('http');
	app.set('port', Configuration.SocketPort3);
	var server = http.createServer(app);
	server.listen(Configuration.SocketPort3);
	updateinitialsetpoint();
	 getKpiList(); 
	getVariableList();
	io = require('socket.io')(server);
	
getInitialData(1);

	/* setInterval(function() {
		getData(1);

	}, 250);
*/
		//console.log(newvar1);
	
  
	 setInterval(function() {
		io.emit('test', KPIsNew);
	}, 100); 

 setTimeout(function() {
	 console.log('*******************It is KPIs****************');
	 console.log(KPIs);
	 console.log('*******************It is KPIs New****************');
	console.log(KPIsNew);
	}, 10000);  	
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