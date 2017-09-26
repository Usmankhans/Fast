var express = require('express');
//var app = express();
//var server = app.listen(3000);
//var socket = require('socket.io');
//var io = socket(3000);
var router = express.Router();
var fs = require('fs');
var Configuration = {};
var events = require('events');
var eventEmitt = new events.EventEmitter();
var http = require('http');
var request = require('request');
var path = require('path');
var xml = require('xml');
//var xml2js = require('xml2js');
//var parser = new xml2js.Parser();
var querystring = require('querystring');
var Client = require('node-rest-client').Client;
var client = new Client();


router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



fs.readFile('public/Configuration.json', 'utf8', function(err, data) {
	Configuration = JSON.parse(data);
	eventEmitt.emit('Intialization');
});
eventEmitt.on('Intialization', function() {

});

var equipmentlist = ["Robot 1", "Robot 2", "Robot 3", "Robot 4", "Robot 5", "Robot 6", "Robot 8", "Robot 9", "Robot 10", "Robot 11", "Robot 12"];


var listkpi = ["Availability", "Setup rate", "Effective", "usman"];

router.get('/list', function(req, res, next) {

	res.send(equipmentlist);
});

router.get('/getXmlList', function(req, res, next) {
	fs.readdir('public/xmlfile', (err, files) => {
		var fileslist =[];
  	files.forEach(function(entry) {
fileslist.push(path.basename(entry, '.xml')); // hello
}); 
		res.send({data:fileslist});
	});
});

router.get('/readXmlFile/:file_name', function(req, res, next) {
	var filename = req.params.file_name + '.xml';
	fs.readFile('public/xmlfile/'+filename, 'utf8', function(err, data) {
		res.set('Content-Type', 'application/xml');
		res.send(data);
	});
	
});


router.get('/sample', function(req, res, next) {
	fs.readFile('public/sample.xml', 'utf8', function(err, data) {
		res.send(data);
	});

});
router.get('/assign-Equipment/:kpiname', function(req, res, next) {

	res.send(equipmentlist);

	//res.send(data);
});


//var myquery= querystring.stringify({query:"PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> SELECT ?KPIs ?Trends WHERE {?KPIs test:hasTrend ?Trends. FILTER(?Trends= test:Lower_the_better)}LIMIT 25"});
// var myquery1 = querystring.stringify({query: "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>select ?s ?p ?time {[] test:APT ?s; test:hasValues ?p; test:hasTime ?time} order by ?time"});
// var myquery2 = querystring.stringify({update: "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> INSERT { ?KPI_Variables test:hasValue_ROB1 2000} WHERE { ?KPI_Variables test:hasValue_ROB1 ?Newvalue FILTER(?KPI_Variables= test:Actual_Production_Time)}"});
// //console.log(myquery2);
// //console.log(myquery1);
// /*****************************GET Method to access Fuseki Server**************************************/

//  request.get('http://localhost:3030/DS-1/sparql?'+myquery1+'&format=json', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//    // Show the HTML for the Google homepage.
// console.log('successful get');
// console.log(body);
// var parseit= JSON.parse(body);
// //console.log(parseit);
//   var Blength=parseit.results.bindings.length;
//   //console.log(parseit.results.bindings[0].o.value);
//   for(i=0; i<Blength; i++)
//    {
//    	console.log(parseit.results.bindings[i].p.value);
//    }
//   } else
//   {
//    console.log(response.statusCode)
//    console.warn(error);
//   }
//  //Res_Obj= parseit.results.bindings[0].Newvalue.value;
//  Res_obj=body;
// });

// console.log(Res_Obj);

// 	//if(LINK.length == )
// 	//Res_Obj = LINK[1];
// //console.log(req.originalUrl);
// 	res.send(Res_Obj);
// });

module.exports = router;