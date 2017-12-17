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
  var XMLWriter = require('xml-writer');
    xw = new XMLWriter;
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
var formulaRepeat=0;
var Good_Quantity=0;
var Scrap_Quantity=0;
var Produced_Quantity=0;
var Previously_Unloaded=0;
var UpdateFrontEnd = require('./UpdateFrontEnd');
var credentials;
var variables;
var totalResult;
var formulas;
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


function UpdateQuality(VariableName, Property, Produced_Quantity){
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?s; test:hasValue ?p; test:hasTime ?now.} where {values (?s ?p ) {(test:"+VariableName + " "+ Property + ")} bind (now() as ?now)}; insert {[] test:Kpi_Variable ?q; test:hasValue ?w; test:hasTime ?now.} where {values (?q ?w ) {(test:Produced_Quantity " + Produced_Quantity + ")} bind (now() as ?now)};	";
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
			var QualityVariables= ['Good_Quantity','Scrap_Quantity','Produced_Quantity'];
			getupdatedData(QualityVariables);
			//getNewdata(str);
			//console.log(body);
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
}


/*****************************************************************FormulaList*********************************************/
function getFormulaList() {


	return new Promise(function(resolve, reject){ 
					
		var FormulaGet = 'PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> Select ?kpi ?formula where{ ?z test:hasFormula ?formula.   bind(strafter(str(?z),"http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#") as ?kpi)}';
		var FormulaQuery = qs.stringify({
			query: FormulaGet
		});				
	
		var FormulaList= {};
		request.get('http://localhost:3030/DS-1/sparql?' + FormulaQuery + '&format=json', function(error, response, body) {
			if (!error && response.statusCode == 200) {
					//console.log(body);
					var parseit = JSON.parse(body);
					var bindings = parseit.results.bindings;
					
					bindings.forEach(function(kpiinitial, currindex){
			
							FormulaList[kpiinitial.kpi.value]=  kpiinitial.formula.value;
							
					});
					
					resolve(FormulaList);
			}
			else {

				//console.log(response.statusCode)
				console.warn(error);
				reject(error);
			}
			
		});	
	
	});

	//return FormulaList;
}   

/*****************************************************************KPILIST*********************************************/
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
						//KPIsNew[kpiinitial.kpi.value]=[];
					count++;
					delete kpiinitial.variable;
					});
					
				var str = JSON.stringify(finalArray, null, 2);
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
return new Promise(function(resolve, reject){ 
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
			
				resolve(str);
				//getNewdata(str);
				 //setTimeout(function(){}, 2000);
		
 		}
 		else {
reject('Error');
			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
});
}  

 

/*********************************************************************************************************************/
/*------------------------------------New self formula execution Function--------------------------------------------*/
function calculate(para1, formula){
		
    	var paraArray = formula.split(" ");
      //console.log(paraArray);
      argu = [];
      paraArray.forEach(function(x){
      if(x.length > 1 && isNaN(x))
      	argu.push(x);
      });
     
     // console.log(argu);
      formula = "return ".concat(formula);
      //console.log(formula);
      var myFunc = new Function(argu, formula);
      //console.log(myFunc(9,3))
      
      var data1 = para1[argu[0]];
      var data2 = para1[argu[1]];



     if (data2.length>0 && data1.length>0){
      var len = data1.length > 1 ? data1.length : data2.length;
      //console.log(len);
	 
   		var finalResult = [];
      for(var i = 0; i < len; i++){
      var a = data1.length > 1 ? data1[i][Object.keys(data1[i])[0]] : data1[0][Object.keys(data1[0])[0]]
      var b = data2.length > 1 ? data2[i][Object.keys(data2[i])[0]] : data2[0][Object.keys(data2[0])[0]]
      //console.log(Object.keys(data1[i])[0] + " : "+myFunc(a,b))
     // var x = Object.keys(data1[i])[0] + " : "+myFunc(a,b);
     // var y = Object.keys(data1[i])[1] +" : "+data1[i][Object.keys(data1[i])[1]]
      var me = {};
      me[Object.keys(data1[i])[0]] = myFunc(a,b);
	  var time;
	 if (data1.length ===1 && data2.length===1){
		 time= data2[0][Object.keys(data2[0])[1]]
	 }
	 else if(data2.length>1){
		 time= data2[i][Object.keys(data2[i])[1]];
	 }
	 else if(data1.length >1 && data2.length===1){
		 time =data1[i][Object.keys(data1[i])[1]];
	 }
	  //var time = data2.length>1 ? data2[i][Object.keys(data2[i])[1]] : data1[i][Object.keys(data1[i])[1]];
      me[Object.keys(data2[0])[1]] = time;
      
      finalResult.push(me);
      }
      
      return finalResult;
	 }
      //console.log(finalResult)
         
}

//start();
/* var tempData = {
	qualityRatio : [],
	availability : {}
}; */
var tempData = {};
function testFormula(allFormula, userData){
	console.log('***********I am formulas in testFormula********************')
	 console.log(allFormula);
 console.log('***********I am userdata in testFormula********************')
	 console.log(userData);

  for (var key in userData) {
    userData[key].sort(function (a, b) {
      return Object.keys(a)[0].replace(/\D/g,'') - Object.keys(b)[0].replace(/\D/g,''); 
    })}
    totalResult = {};
	var timeQuality = -1;
			for (var key in allFormula) {
      	//console.log(allFormula[key]);
        var formula = allFormula[key];
        //formula = "return ".concat(formula);
        //console.log(formula);
        gotResult = calculate(userData, formula) 
        totalResult[key] = gotResult;
		
		}
		//console.log(totalResult,'***********I am 0000000 tempdata newwwwwwwwwwwwwwwwwwww********************');
	 	for (var keys in totalResult) { 
		if(!tempData[keys])
		{
		tempData[keys]={}
		}
		totalResult[keys].forEach(function(avaldata) {	
		 var keyObj = Object.keys(avaldata)[0];
		if(!tempData[keys][keyObj]){
					
					tempData[keys][keyObj] = []; 		
		}
		
		var length = tempData[keys][keyObj].length-1;
		if (tempData[keys][keyObj].length==0 || tempData[keys][keyObj][length][0]!=avaldata.hasTime){
	
		tempData[keys][keyObj].push([avaldata.hasTime, avaldata[keyObj] , 100-avaldata[keyObj]] );
		}
		if (tempData[keys][keyObj].length==5){
					tempData[keys][keyObj].shift();
				}
		
		}); 
		/* }
				if(!tempData.availability[keyObj]){
					tempData.availability[keyObj] = [];
				}
				tempData.availability[keyObj].push([avaldata.hasTime, avaldata[keyObj] , 100-avaldata[keyObj]] ); */
		}
		 
	/* 	if(totalResult['Availability']){
			
			totalResult['Availability'].forEach(function(avaldata) {
				
				var keyObj = Object.keys(avaldata)[0];
				if(!tempData.availability[keyObj]){
					tempData.availability[keyObj] = [];
				}
				tempData.availability[keyObj].push([avaldata.hasTime, avaldata[keyObj] , 100-avaldata[keyObj]] );
				//console.log(tempData.availability);
			});
			
		} 
      
		if(totalResult['Quality-Ratio'] && totalResult['Quality-Ratio'][0] ){
			if(totalResult['Quality-Ratio'][0].hasTime!=timeQuality){
				timeQuality= totalResult['Quality-Ratio'][0].hasTime;
				tempData.qualityRatio.push([totalResult['Quality-Ratio'][0].hasTime,totalResult['Quality-Ratio'][0].hasValue, 100 - totalResult['Quality-Ratio'][0].hasValue]);
				/*console.log('***********I am tempdata newwwwwwwwwwwwwwwww********************');
				console.log(tempData);
				
				if (tempData.qualityRatio.length==5){
					tempData.qualityRatio.shift();
				}	
			}
		} */ 
	
	  console.log('***********I am tempdata in testFormula********************');
	   console.log(tempData);
	   console.log('***********I am total result in testFormula********************');
      console.log(totalResult);
	  io.emit('test', tempData);
	    console.log('*******************************');
}

/*-----------------------------------------------Formula function End---------------------------------------------------------------*/
/************************************************************************************************************************************/



    /****************************Get updated data generic***********************************************************************************/
	function getupdatedData(variable)
	{
		variable.forEach(function(eachvariable){
			
			
		
		NewVariable[eachvariable].forEach(function(equipment){ 
var propkey=Object.keys(equipment);
	
	var getQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>SELECT ?s ?p ?time { [] test:Kpi_Variable ?s; test:" + propkey[0] + " ?p; test:hasTime ?time. FILTER(?s= test:"+eachvariable+")} order by ?time";
 	var myquery1 = qs.stringify({
 		query: getQuery
 	});
	
		request.get('http://localhost:3030/DS-1/sparql?' + myquery1 + '&format=json', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var parseit = JSON.parse(body);
 			var Blength = parseit.results.bindings.length;
 			var Total = 0;
 			myarr = new Array();
 			for (var j = 0; j < Blength; j++) {
 				var new_value = parseFloat(parseit.results.bindings[j].p.value)
 				myarr.push(new_value);
 				Total = new_value + Total;
 			}
			if(Blength>0){
			equipment[propkey[0]]=Total;
			equipment[propkey[1]]=parseit.results.bindings[Blength-1].time.value;
			}
		}
		else {

	 		console.warn(error);
		}
		
		});
	
		
		
		
		
		});
		
		});
		
		setTimeout(function(){  
		testFormula(formulas, NewVariable );
		}, 5000);
		
	}
	
	
	
/***********************************************get data from fuseki server*****************************/
	
function getData(i, Update_Variable)	{
	var rob_number = "ROB" + i + "_Availability";
	if(Update_Variable=='APT'){
		var variablename='Actual_Production_Time'
 	var getQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>SELECT ?s ?p ?time { [] test:Kpi_Variable ?s; test:hasValue_ROB" + i + " ?p; test:hasTime ?time. FILTER(?s= test:Actual_Production_Time) } order by ?time";
 	var myquery1 = qs.stringify({
 		query: getQuery
 	});
	}
	else if(Update_Variable=='AUBT'){
		var variablename='Actual_Unit_Busy_Time';
 	var getQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>SELECT ?s ?p ?time { [] test:Kpi_Variable ?s; test:hasValue_ROB" + i + " ?p; test:hasTime ?time. FILTER(?s= test:Actual_Unit_Busy_Time) } order by ?time";
 	var myquery1 = qs.stringify({
 		query: getQuery
 	});
	}
	
	
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
propertyupdate = "hasValue_ROB" + i;
 		
 			var TTR= parseFloat(((Total_time_ROB / 600) * 100).toFixed(2));
			NewVariable[variablename].forEach(function(property){
				var propkey= Object.keys(property);
				if (propkey[0]==propertyupdate)
				{
					property[propertyupdate]= Total_time_ROB;
					property[propkey[1]]=parseit.results.bindings[Blength-1].time.value;
	
					testFormula(formulas, NewVariable);
					
				}
			});
 			KPIs["Availability"][i-1][rob_number] = TTR;
                  
 		}
 		else {

			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
} 
	
 function getNewdata(input){
	 
	var numberOfPromises = input.length;
	var currPromiseCount = 0;
	
	
	
	 return new Promise(function(resolve, reject){ 
		
	var inp = JSON.parse(input)
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
			//console.log(parseit);
			if (Blength>0){
				newobject['hasTime']=parseit.results.bindings[Blength-1].time.value;
			}
			else
			{				
				newobject['hasTime']=0;
		}
			//newobject['hasTime']=parseit.results.bindings[0].time.value;
			newvar2.value.push(newobject);
			NewVariable[variablelist.KpiVariable.value].push(newobject);
 			//KPIsNew.push({"name":propertylist, value:[]});
        
 			//ewvar1=newvar2;
	//console.log(newvar1);
 		}
 		else {
reject('Error');
 	
			//console.log(response.statusCode)
	 		console.warn(error);
		}
 	});
			
		});	 
		
		/*newvar1.push(newvar2);
		itemsProcessed++;
    if(itemsProcessed === x.length) {
	
		setTimeout(function(){ evaluateformula(NewVariable,KpiList); }, 2000);
		
	}*/
		});
		 setTimeout(function(){ 
		 
		 resolve(NewVariable); }, 2000);
	 });
		
	} 
	
	
	
	
function updateinitialsetpoint() {
	return new Promise(function(resolve, reject){ 
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?s; test:hasValue ?p; test:hasTime ?now.} where {values (?s ?p ) {(test:Planned_Busy_Time  3600)} bind (now() as ?now)}";

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
			resolve();
		//	getKpiList(); 
	//getVariableList();
			//console.log(body);
		} else {
			reject();
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
	});
} 	
	
	
	
/******************************************Update Data Set Function(Sending POST Request to Fuseki Server)****************************/
function updateDS(productionSecs, Update_Variable, ws_number) {
	
if(Update_Variable=='APT'){
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?s; test:hasValue_ROB" + ws_number + "?p; test:hasTime ?now.} where {values (?s ?p) {(test:Actual_Production_Time " + productionSecs + " )} bind (now() as ?now)}";
	var myquery2 = qs.stringify({
		update: updateQuery
	});
}
else if (Update_Variable=='AUBT'){
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#> insert {[] test:Kpi_Variable ?a; test:hasValue_ROB" + ws_number + " ?b; test:hasTime ?now.} where {values (?a ?b) {( test:Actual_Unit_Busy_Time " + productionSecs + "  )} bind (now() as ?now)}";
	var myquery2 = qs.stringify({
		update: updateQuery
	});
	
}

	request.post({
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		url: 'http://localhost:3030/DS-1/?' + myquery2
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('successful update');
			getData(ws_number, Update_Variable);
			//getNewdata(str);
			//console.log(body);
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
}  //updateDS End


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





function createnewKPI(newkpidata,formvariables){
	var updateQuery = 'PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>PREFIX owl:<http://www.w3.org/2002/07/owl#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> INSERT DATA {test:'+newkpidata.Name+ ' rdf:type test:KPIs, owl:NamedIndividual. test:'+newkpidata.Name+ ' test:hasDescription "' +newkpidata.Description+'". test:'+newkpidata.Name+ ' test:hasFormula "'+newkpidata.Formula+'" . test:'+newkpidata.Name+ ' test:hasID "'  +newkpidata.ID+'" . test:'+newkpidata.Name+  ' test:hasName "'  +newkpidata.Name+'". test:'+newkpidata.Name+ ' test:hasRangeID "'  +newkpidata.Range.ID+'". test:'+newkpidata.Name+ ' test:hasRangeDescription "'  +newkpidata.Range.Description+'" .test:'+newkpidata.Name+ ' test:hasRangeLowerLimit "'  +newkpidata.Range.LowerLimit+'" .test:'+newkpidata.Name+ ' test:hasRangeUpperLimit "'  +newkpidata.Range.UpperLimit+'" . test:'+newkpidata.Name+  ' test:hasScope "' +newkpidata.Scope+'" . test:'+newkpidata.Name+	' test:hasTrend "'   +newkpidata.Trend+'" . test:'+newkpidata.Name+' test:hasUnitOfMeasure "' +newkpidata.UnitOfMeasure+'" . test:'+newkpidata.Name+   ' test:hasNotes "' +newkpidata.Notes+'". ';
newkpidata.Timing.forEach(function(eachtime){
	updateQuery= updateQuery + 'test:'+newkpidata.Name+' test:hasTiming "'+eachtime+'". ';
});
newkpidata.Audience.forEach(function(eachaudience){
	updateQuery= updateQuery + 'test:'+newkpidata.Name+' test:hasAudience "'+eachaudience+'". ';
});
newkpidata.ProductionMethodology.forEach(function(eachpm){
	updateQuery= updateQuery + 'test:'+newkpidata.Name+' test:hasProductionMethodology "'+eachpm+'". ';
});
formvariables.forEach(function(eachvariable){
updateQuery= updateQuery + 'test:'+newkpidata.Name+' test:hasVariable test:'+eachvariable.firstvariable+', test:'+eachvariable.secondvariable+' . }';
});
console.log(updateQuery);
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
			getFormulaList().then(function(formula) {
		formulas = formula;
			console.log('*******************It is New formulasList****************');
			console.log(formulas);
			console.log('*******************It is New formulasList****************');
			testFormula(formulas, NewVariable );
	}).catch(function(err) {
		console.log(err);
	});	
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	}); 
	
}







/**************************************** Recieves Post Notification from Simulator whenever something changes on the simulator*****************************************/
router.post('/data', function(req, res) {
	res.end(); 
	
	var notif = req.body;
//console.log(req.body);
	/********************************* When Conveyor Start Transferring *****************************************/
		if (notif.Msg == 'ConveyorStartTransferring') {

			if (notif.WS == '1') {

	if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB1_Busy_start=Date.now()/1000;
				} 
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB1_Busy_stop=Date.now()/1000;
	var ROB1_Total_Busy= ROB1_Busy_stop-ROB1_Busy_start;
	updateDS(ROB1_Total_Busy,'AUBT', notif.WS);
				} 
			}
			if (notif.WS == '2') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB2_Busy_start=Date.now()/1000;
				}  
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB2_Busy_stop=Date.now()/1000;
	var ROB2_Total_Busy= ROB2_Busy_stop-ROB2_Busy_start;
	updateDS(ROB2_Total_Busy,'AUBT', notif.WS);
				}  
			}
			if (notif.WS == '3') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB3_Busy_start=Date.now()/1000;
				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB3_Busy_stop=Date.now()/1000;
	var ROB3_Total_Busy= ROB3_Busy_stop-ROB3_Busy_start;
	updateDS(ROB3_Total_Busy,'AUBT', notif.WS);
				}			
			}
			if (notif.WS == '4') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB4_Busy_start=Date.now()/1000;
				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB4_Busy_stop=Date.now()/1000;
	var ROB4_Total_Busy= ROB4_Busy_stop-ROB4_Busy_start;
	updateDS(ROB4_Total_Busy,'AUBT', notif.WS);
				}			
			}
			if (notif.WS == '5') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB5_Busy_start=Date.now()/1000;
				}  
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB5_Busy_stop=Date.now()/1000;
	var ROB5_Total_Busy= ROB5_Busy_stop-ROB5_Busy_start;
	updateDS(ROB5_Total_Busy,'AUBT', notif.WS);
				} 
			}
			if (notif.WS == '6') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB6_Busy_start=Date.now()/1000;
				}  
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB6_Busy_stop=Date.now()/1000;
	var ROB6_Total_Busy= ROB6_Busy_stop-ROB6_Busy_start;
	updateDS(ROB6_Total_Busy,'AUBT', notif.WS);
				} 
			}

			if (notif.WS == '7') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB7_Busy_start=Date.now()/1000;
				}  
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB7_Busy_stop=Date.now()/1000;
				}
			}
			if (notif.WS == '8') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
					
	ROB8_Busy_start=Date.now()/1000;
	

				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
					
	ROB8_Busy_stop=Date.now()/1000;
	var ROB8_Total_Busy= ROB8_Busy_stop-ROB8_Busy_start;
updateDS(ROB8_Total_Busy,'AUBT', notif.WS);
				} 			
			}
			if (notif.WS == '9') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB9_Busy_start=Date.now()/1000;
				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB9_Busy_stop=Date.now()/1000;
	var ROB9_Total_Busy= ROB9_Busy_stop-ROB9_Busy_start;
	updateDS(ROB9_Total_Busy,'AUBT', notif.WS);
				} 			
				
			}
			if (notif.WS == '10') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB10_Busy_start=Date.now()/1000;

				}  
				if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB10_Busy_stop=Date.now()/1000;
	var ROB10_Total_Busy= ROB110_Busy_stop-ROB10_Busy_start;
	updateDS(ROB10_Total_Busy,'AUBT', notif.WS);
				}  
			}
			if (notif.WS == '11') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB11_Busy_start=Date.now()/1000;
				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB11_Busy_stop=Date.now()/1000;
	var ROB11_Total_Busy= ROB11_Busy_stop-ROB11_Busy_start;
	updateDS(ROB11_Total_Busy,'AUBT', notif.WS);
				}			
			}
			if (notif.WS == '12') {
				if (notif.From == '1'  &&  notif.To == '2' ) {
	ROB12_Busy_start=Date.now()/1000;
				} 
	if (notif.From == '3'  &&  notif.To == '5' ) {
	ROB12_Busy_stop=Date.now()/1000;
	var ROB12_Total_Busy= ROB12_Busy_stop-ROB12_Busy_start;
	updateDS(ROB12_Total_Busy,'AUBT', notif.WS);
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
	if ((notif.MSG == 'RobotStartLoading' && notif.PalletID!='-1')|| notif.Msg == 'RobotStartUnloading' && notif.PalletID!='-1') {

	ROB1_StartSeconds=Date.now()/1000;
		


	}
	if (notif.MSG == 'PaperLoaded' || notif.MSG == 'PaperUnloaded') {
			console.log(req.body);
		ROB1_StopSeconds=Date.now()/1000;
	
		var ROB1_Total_Seconds = ROB1_StopSeconds - ROB1_StartSeconds;
		
		updateDS(ROB1_Total_Seconds,'APT', notif.WS);
if (notif.MSG == 'PaperUnloaded'){
	Previously_Unloaded = Produced_Quantity;
		
		Produced_Quantity=1;
		Quality = Math.floor((Math.random() * 30) + 70);
		console.log('Qualitis ********** ', Quality);
		if (Quality >=80)
		{
			
			Good_Quantity=1;
			UpdateQuality('Good_Quantity', Good_Quantity, Produced_Quantity);
		}
		else if (Quality<80)
		{
			
			Scrap_Quantity=1;
			UpdateQuality('Scrap_Quantity', Scrap_Quantity, Produced_Quantity);
		}
}

	}

	/******************************Pallet Loading and Unloading Notifications********************************/

if (notif.MSG == 'PalletUnloaded') {

if (notif.PalletID>0){
		
}
	}
	
	/************************* When Robot Start drawing**************************/
	if (notif.MSG == 'RobotStartDrawing' && notif.PalletID!='-1') {

		if (notif.WS == '2') {
			
ROB2_StartSeconds=Date.now()/1000;
			//console.log(ROB2_StartSeconds);

		}
		if (notif.WS == '3') {
			ROB3_StartSeconds=Date.now()/1000;

			//console.log(ROB3_StartSeconds);

		}
		if (notif.WS == '4') {
			ROB4_StartSeconds=Date.now()/1000;

			//console.log(ROB4_StartSeconds);

		}
		if (notif.WS == '5') {

			ROB5_StartSeconds=Date.now()/1000;

			//console.log(ROB5_StartSeconds);


		}
		if (notif.WS == '6') {
			ROB6_StartSeconds=Date.now()/1000;

			//console.log(ROB6_StartSeconds);


		}
		if (notif.WS == '8') {
			ROB8_StartSeconds=Date.now()/1000;

			//console.log(ROB8_StartSeconds);

		}
		if (notif.WS == '9') {
			ROB9_StartSeconds=Date.now()/1000;

			//console.log(ROB9_StartSeconds);

		}
		if (notif.WS == '10') {
			ROB10_StartSeconds=Date.now()/1000;

			//console.log(ROB10_StartSeconds);

		}
		if (notif.WS == '11') {
			ROB11_StartSeconds=Date.now()/1000;

			//console.log(ROB11_StartSeconds);

		}
		if (notif.WS == '12') {
			ROB12_StartSeconds=Date.now()/1000;

			//console.log(ROB12_StartSeconds);

		}
	}


	/************************* When Robot Stop drawing**************************/

	if (notif.MSG == 'RobotStopDrawing' && notif.PalletID!='-1') {
			
		if (notif.WS == '2') {
			ROB2_StopSeconds=Date.now()/1000;
		
			var ROB2_Total_Seconds = ROB2_StopSeconds - ROB2_StartSeconds;
			//var ROB2_Total_Busy= ROB2_StopSeconds-ROB2_Busy_start;
			
			updateDS(ROB2_Total_Seconds,'APT', notif.WS);

		}
		if (notif.WS == '3') {
			ROB3_StopSeconds=Date.now()/1000;
			//console.log(ROB3_StartSeconds);
			//console.log(ROB3_StopSeconds);
			var ROB3_Total_Seconds = ROB3_StopSeconds - ROB3_StartSeconds;
			//var ROB3_Total_Busy= ROB3_StopSeconds-ROB3_Busy_start;
			//console.log(ROB3_Total_Seconds);
			updateDS(ROB3_Total_Seconds,'APT', notif.WS);

		}
		if (notif.WS == '4') {
			ROB4_StopSeconds=Date.now()/1000;
			//console.log(ROB4_StartSeconds);
			//console.log(ROB4_StopSeconds);
			var ROB4_Total_Seconds = ROB4_StopSeconds - ROB4_StartSeconds;
			//var ROB4_Total_Busy= ROB4_StopSeconds-ROB4_Busy_start;
			//console.log(ROB4_Total_Seconds);
			updateDS(ROB4_Total_Seconds,'APT', notif.WS);

		}
		if (notif.WS == '5') {
			ROB5_StopSeconds=Date.now()/1000;
			//console.log(ROB5_StartSeconds);
			//console.log(ROB5_StopSeconds);
			var ROB5_Total_Seconds = ROB5_StopSeconds - ROB5_StartSeconds;
			//var ROB5_Total_Busy= ROB5_StopSeconds-ROB5_Busy_start;
			//console.log(ROB5_Total_Seconds);
			updateDS(ROB5_Total_Seconds,'APT', notif.WS);
		}
		if (notif.WS == '6') {
			ROB6_StopSeconds=Date.now()/1000;
			//console.log(ROB6_StartSeconds);
			//console.log(ROB6_StopSeconds);
			var ROB6_Total_Seconds = ROB6_StopSeconds - ROB6_StartSeconds;
			//var ROB6_Total_Busy= ROB6_StopSeconds-ROB6_Busy_start;
			//console.log(ROB6_Total_Seconds);
			updateDS(ROB6_Total_Seconds,'APT', notif.WS);

		}
		if (notif.WS == '8') {
			console.log('I have reached safely 22222222222');
			ROB8_StopSeconds=Date.now()/1000;
			console.log(ROB8_StartSeconds);
			console.log(ROB8_StopSeconds);
			var ROB8_Total_Seconds = ROB8_StopSeconds - ROB8_StartSeconds;
				console.log('I have reached safely 11111111');
			//var ROB8_Total_Busy= ROB8_StopSeconds - ROB8_Busy_start;
			console.log('I have reached safely******************');
			updateDS(ROB8_Total_Seconds,'APT', notif.WS);
		}

		if (notif.WS == '9') {
			ROB9_StopSeconds=Date.now()/1000;
			//console.log(ROB9_StartSeconds);
			//console.log(ROB9_StopSeconds);
			var ROB9_Total_Seconds = ROB9_StopSeconds - ROB9_StartSeconds;
			//var ROB9_Total_Busy= ROB9_StopSeconds-ROB9_Busy_start;
			//console.log(ROB9_Total_Seconds);
			updateDS(ROB9_Total_Seconds,'APT', notif.WS);

		}
		if (notif.WS == '10') {
			ROB10_StopSeconds=Date.now()/1000;
			//console.log(ROB10_StartSeconds);
			//console.log(ROB10_StopSeconds);
			var ROB10_Total_Seconds = ROB10_StopSeconds - ROB10_StartSeconds;
			//var ROB10_Total_Busy= ROB10_StopSeconds-ROB10_Busy_start;
			//console.log(ROB10_Total_Seconds);
		updateDS(ROB10_Total_Seconds,'APT', notif.WS);


		}
		if (notif.WS == '11') {
			ROB11_StopSeconds=Date.now()/1000;
			//console.log(ROB11_StartSeconds);
			//console.log(ROB11_StopSeconds);
			var ROB11_Total_Seconds = ROB11_StopSeconds - ROB11_StartSeconds;
			//var ROB11_Total_Busy= ROB11_StopSeconds-ROB11_Busy_start;
			//console.log(ROB11_Total_Seconds);
			updateDS(ROB11_Total_Seconds,'APT', notif.WS);


		}
		if (notif.WS == '12') {
ROB12_StopSeconds=Date.now()/1000;
			
			var ROB12_Total_Seconds = ROB12_StopSeconds - ROB12_StartSeconds;
			
			
			updateDS(ROB12_Total_Seconds,'APT', notif.WS);
		


		}
	}



});  //router.post End

router.post('/deleteData', function(req, res) {
	var deleteEquipmentList= req.body;
	//console.log(deleteEquipmentList);
		deleteData(deleteEquipmentList);
		
});



router.post('/xmlForm', function(req, res) {
	credentials=req.body.credentials;
 variables=req.body.variables;
 console.log(credentials);
 createnewKPI(credentials, variables);
       		xw.startDocument('1.0', 'UTF-8');
			 xw.startElement('KPIDefinition');
    xw.writeAttribute("xsi:schemaLocation", "http://www.mesa.org/xml/KPI-ML-V01 KPI-ML-V01.xsd");
	xw.writeAttribute("xmlns", "http://www.mesa.org/xml/KPI-ML-V01");
	xw.writeAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
	Object.keys(credentials).forEach(function(key) {
  
 //for (var key in credentials) {
	 
	 if (typeof(credentials[key])== 'object' && !Array.isArray(credentials[key])){
		 xw.startElement(key);
		 for (var key1 in credentials[key]) {
			 
			 xw.startElement(key1).text(credentials[key][key1]).endElement(key1);
			 
		 }
		 xw.endElement(key);
		 
		 
		 /* credentials[key].forEach(function(item){
			 console.log('usman');
			  xw.startElement(key).text(item).endElement(key);
		 }) */
		 
	 }
	 else if(typeof(credentials[key])== 'object' && Array.isArray(credentials[key])) {
		 credentials[key].forEach(function(item){
			
			  xw.startElement(key).text(item).endElement(key);
			   });
	 }
	 else{
      		xw.startElement(key).text(credentials[key]).endElement(key);
       
 } 
 
 
});
xw.endElement('KPIDefinition');
	
 
  res.set('Content-Type', 'application/xml');
  res.send(xw.output);
		
});




router.get('/viewData',function(req, res) {
	//console.log('Initial data');
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
			io.emit('test', tempData);
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
router.get('/getXmlList',function(req, res) {
getFormulaList().then(function(formula) {
		formulas = formula;
			console.log('*******************It is New formulasList****************');
			console.log(formulas);
			res.send(Object.keys(formulas));
			
	}).catch(function(err) {
		console.log(err);
	});	
	
		
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
		
	getFormulaList().then(function(formula) {
		formulas = formula;
			console.log('*******************It is formulasList****************');
			console.log(formulas);
			console.log('*******************It is formulasList****************');
	}).catch(function(err) {
		console.log(err);
	});	
	updateinitialsetpoint().then(function(updated){
		
		getKpiList();
		return getVariableList();
	}).then(function(data){
	
		return getNewdata(data);
	}).then(function(variablesData){
		
		
		testFormula(formulas, variablesData );
		 
	}).catch(function(err){ 
	consol.log('here is the problem');
	console.log(err)});


	io = require('socket.io')(server);
	
 
 
  	
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