var request = require('request');
var qs = require('qs');
var http = require("http");

function updateView(kpi, EquipmentName) {
		console.log("*************Hey hello i am updateView*****************");
	 console.log(kpi, EquipmentName);
	var viewUpdateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>INSERT DATA{ test:"+kpi+" test:isViewed '"+EquipmentName+"'}";

	var viewUpdate = qs.stringify({
		update: viewUpdateQuery
	});

	request.post({
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		url: 'http://localhost:3030/DS-1/?' + viewUpdate
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('successful update');
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
}  
	
	
function deleteView(kpi, EquipmentName){
	console.log("*************Hey hello i am deleteView*****************");
	console.log(kpi, EquipmentName);
	var deleteViewQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>DELETE DATA{ test:"+kpi+" test:isViewed '"+EquipmentName+"'}";

	var viewDelete = qs.stringify({
		update: deleteViewQuery
	});

	request.post({
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		url: 'http://localhost:3030/DS-1/?' + viewDelete
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('successful delete');
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
	
	
}	;

module.exports={ updateView, deleteView};