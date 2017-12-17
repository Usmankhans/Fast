angular.module('kpi', [])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('//');
		$interpolateProvider.endSymbol('//');
	})
	.controller('kpiCtrl', function($scope, $http, $timeout, $filter, kpiSocket,$rootScope, $window) {
		 $scope.checkedequipment = [];
		  $scope.checkedequipment1 = [];
		 $scope.checkedequipmentList = [];
		$scope.xmlList = {};
		$scope.xmlFile = "";
		$scope.xmlFile1 = "";
      	$scope.xmlFileName = "";
		$scope.xmlFileName1 = "";
		$scope.xmlFileName = "";
		$scope.visualize = "pie";
		$scope.timinglist = ['On-demand','Real-Time', 'Periodic'];
$scope.audiencelist = ['Operator','Supervisor', 'Management'];
$scope.pmlist = ['Batch','Continuous', 'Discrete'];
		$scope.variablelist=['Actual_Unit_Busy_Time','Actual_Production_Time', 'Produced_Quantity', 'Planned_Busy_Time', 'Good_Quantity', 'Scrap_Quantity'];
$scope.operatorlist=['/', '*','+','-'];
$scope.numbers=[0, 1, 25, 50,75, 100, 3600];
		var globalData;
		var tempoVal;
		var tempoProperty;
		var kpiname;
		var datata=[];
		var datata1=[];
		var datata2=[];
		var time;
		var time1;
		var time3;
		var saveformFlag=false;
			var i=2010;
				var year;
				var year1;
		$scope.selectRob = [];
		$rootScope.Utils = {
     keys : Object.keys
  }
  kpiSocket.on('test', function(msg) {
console.log('first I got KPINew');
 	globalData = msg;
 	var message = msg;
	console.log(msg);
	google.charts.load('current', {
 		'packages': ['corechart']
 	});
	var datetime= new Date(msg['Quality-Ratio'].hasValue[0]);
	//console.log('I am fucking time', datetime);
	
 	google.charts.setOnLoadCallback(function() {
 /*if (time!=msg['Quality-Ratio'][0].hasTime)
		{  
		 //year=i.toString();
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
		time= msg['Quality-Ratio'][0].hasTime;
		var datetime= new Date(msg['Quality-Ratio'][0].hasTime);
		 datata.push([datetime,msg['Quality-Ratio'][0].hasValue, 100 - msg['Quality-Ratio'][0].hasValue]);
		 if (datata.length==5){datata.shift();}	
		 } */
		 for (var key in msg){

			 for (var key1 in msg[key]){
				 //console.log('//////////////////////////////////////////////');
				 //console.log(msg[key][key1]);
				 var biggerArray = msg[key][key1];
				 for(var count=0;count<biggerArray.length;count++){
					 
					 var smallerArray = biggerArray[count];
					 smallerArray[0] = new Date(smallerArray[0]);
				 
			 }
		 }
		 }
		 console.log(msg);
			angular.forEach(msg.QualityRatio, function(value, key) {
				value[0] = new Date(value[0]);
				this.push(value);
			}, datata);
		 //datata = msg.abc;
		// console.log(datata);
 
 		//console.log(message);
 		if (tempoVal) {
			//console.log(tempoProperty);
			//console.log(kpiname);
 			$scope.dataInfo(message, kpiname, tempoVal, tempoProperty, $scope.visualize)
 		}

 	});
 });
 

 $scope.checkedtime = [];
$scope.checkedaudience = [];
$scope.checkedpm = [];
$scope.timinglist = ['On-demand','Real-Time', 'Periodic'];
$scope.audiencelist = ['Operator','Supervisor', 'Management'];
$scope.pmlist = ['Batch','Continuous', 'Discrete'];
	 
$scope.newXml;


var credentials = {
   'ID' : " ",
   'Description': " ",
    'Name' : " ",
	'Scope': " ",
	'Formula': " ",
	'UnitOfMeasure': " ",
   'Range' : {
	   'ID': " ", 
   'Description': " ", 
   'LowerLimit': " ",
   'UpperLimit': " "},
   'Trend': " ",
   'Timing': " ",
   'Audience' : " ",
   'ProductionMethodology': " ",
   'Notes': " "
 };
 $scope.save_form=function(){
	  $scope.Formula1= $scope.firstvariable+' '+$scope.firstoperator+' '+$scope.secondvariable+' '+$scope.secondoperator+' '+$scope.lastnumber;
	   var variables=[{'firstvariable': $scope.firstvariable, 'secondvariable': $scope.secondvariable}];
	 credentials = {
   'ID' : $scope.ID,
   'Description' : $scope.Description,
    'Name' : $scope.Name,
	'Scope': $scope.Scope,
	'Formula':$scope.Formula1,
	'UnitOfMeasure': $scope.Unit,
   'Range' : {'ID': $scope.RangeID, 
   'Description': $scope.RangeDescription, 
   'LowerLimit': $scope.LowerLimit,
   'UpperLimit': $scope.UpperLimit},
   'Trend': $scope.Trend1,
   'Timing': $scope.checkedtime,
   'Audience' : $scope.checkedaudience,
   'ProductionMethodology': $scope.checkedpm,
   'Notes': $scope.Notes
   

   
 };
 
 saveformFlag=true;
 var formdata= {'credentials':credentials,'variables': variables};
 $http.post("http://localhost:3000/kpi/xmlForm",formdata )
				.then(function(response) {
					console.log(response);
					$scope.newXml= response.data;
					$scope.loadData();
				}).catch(function(err) {
		console.log(err);
	});

	 console.log(credentials);

 };
  $scope.download_form=function(){
	  if ($scope.newXml && saveformFlag){
		  
	
	  var hiddenElement = document.createElement('a');

hiddenElement.href = 'data:attachment/xml,' + encodeURI($scope.newXml);
hiddenElement.target = 'http://localhost:3000/public';
hiddenElement.download = credentials.Name+'.xml';
hiddenElement.click();
	  }
	  else {
var r = confirm("Please Submit the form first before downloading!");
		  if (r == true) {
     console.log(document.getElementById("exampleModalLong").style.display)
} else {
    document.getElementById("exampleModalLong").style.display="none";
}
	  }
}; 
$scope.toggleCheck11 = function (time) {
        if ($scope.checkedtime.indexOf(time) === -1) {
            $scope.checkedtime.push(time);
			console.log($scope.checkedtime);
			
        } else {
            $scope.checkedtime.splice($scope.checkedtime.indexOf(time), 1);
			console.log($scope.checkedtime);
			
        }
};
$scope.toggleCheck2 = function (audience) {
        if ($scope.checkedaudience.indexOf(audience) === -1) {
            $scope.checkedaudience.push(audience);
			console.log($scope.checkedaudience);
			
        } else {
            $scope.checkedaudience.splice($scope.checkedaudience.indexOf(audience), 1);
			console.log($scope.checkedaudience);
			
        }
};
$scope.toggleCheck3 = function (pm) {
        if ($scope.checkedpm.indexOf(pm) === -1) {
            $scope.checkedpm.push(pm);
			console.log($scope.checkedpm);
			
        } else {
            $scope.checkedpm.splice($scope.checkedpm.indexOf(pm), 1);
			console.log($scope.checkedpm);
			
        }
};
 
 
 
 
 
 
 
 
 
 
 
 
		//$scope.equipmentlist = ["Robot 1", "Robot 2", "Robot 3", "Robot 4", "Robot 5", "Robot 6", "Robot 8", "Robot 9", "Robot 10", "Robot 11", "Robot 12"];
		//$scope.robotMapp =["abc.xml  :  ROBOT-2", "abc.xml  :  ROBOT-3"];
    

		var url = "http://localhost:3000/kpiValue/";
		// $scope.equipment = [{
		// 	name: "Robot 1",
		// 	status: 0
		// }, {
		// 	name: "Robot 2",
		// 	status: 0
		// }, {
		// 	name: "Robot 3",
		// 	status: 0
		// }, {
		// 	name: "Robot 4",
		// 	status: 0
		// }, {
		// 	name: "Robot 5",
		// 	status: 0
		// }, {
		// 	name: "Robot 6",
		// 	status: 0
		// }, {
		// 	name: "Robot 7",
		// 	status: 0
		// }, {
		// 	name: "Robot 8",
		// 	status: 0
		// }, {
		// 	name: "Robot 9",
		// 	status: 0
		// }, {
		// 	name: "Robot 10",
		// 	status: 0
		// }];

$scope.loadData = function() {
          $http.get("http://localhost:3000/kpi/getXmlList")
				.then(function(response) {
					$scope.xmlList = response.data;
					console.log('I got new list');
					console.log(response.data);
				}).catch(function(err) {
		console.log(err);
	});	
};

$scope.getEquipmentlist = function(xmlFileName) {
	console.log(xmlFileName);
          $http.get(url + "/assign-Equipment/"+xmlFileName)
				.then(function(response) {
					$scope.equipmentlist = response.data;
		//console.log($scope.xmlFileName);
				});

};

$scope.getEquipmentlistDelete = function() {
          $http.get(url + "list")
				.then(function(response) {
					$scope.equipmentlistDelete = response.data;
		//console.log($scope.xmlFileName);
				});

};

$scope.toggleCheck = function (equipment) {
        if ($scope.checkedequipment.indexOf(equipment) === -1) {
            $scope.checkedequipment.push(equipment);
          
        } else {
            $scope.checkedequipment.splice($scope.checkedequipment.indexOf(equipment), 1);
        }
};


$scope.toggleCheck1 = function (equipment) {
        if ($scope.checkedequipment1.indexOf(equipment) === -1) {
            $scope.checkedequipment1.push(equipment);
			
        } else {
            $scope.checkedequipment1.splice($scope.checkedequipment1.indexOf(equipment), 1);
			
        }
};

$scope.deleteData=function (equipment) {
   
	  $http.post("http://localhost:3000/kpi/deleteData",$scope.checkedequipment1 )
				.then(function(response) {
					
				});
           
};
 /* $scope.updateDS =function(Kpi, EquipmentName) {
	 
	 
	 $http.post("http://localhost:3000/kpi/deleteData",$scope.checkedequipment1)
	var updateQuery = "PREFIX test:<http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>INSERT DATA{ test:"+Kpi+" test:isViewed"+EquipmentName+"}";

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
		} else {
			//console.log(response.statusCode)
			console.warn(error);
		}
	});
}  
 */
$scope.save_equipment = function() {
	$scope.equipmentlist=[];
	var xmlFileName =$scope.xmlFileName;
	console.log($scope.checkedequipment);
	$scope.checkedequipment.sort();
	$scope.checkedequipment.forEach(function (equipment){
		var dataToSend = {
						'checkedequipment': equipment,
						'xmlFileName': xmlFileName
						
					};
			var newobject = {};
			var checkExistence = false;
            newobject[xmlFileName] = equipment; 
            if ($scope.checkedequipmentList.length){
            $scope.checkedequipmentList.forEach(function (currentobject){
		    if (angular.equals(newobject,currentobject) )
						    {
						    	checkExistence=true;
						    }
            });
            if(!checkExistence){
            		$scope.checkedequipmentList.push(newobject);
					
					
					$http.post("http://localhost:3000/kpi/insertView",dataToSend )
				.then(function(response) {
				
					});
					//$scope.updateDS(xmlFileName, equipment );
            }
            else{

            	alert(equipment + " Already exist for this " + xmlFileName);
            } 
        }
        else 
        {
        	$scope.checkedequipmentList.push(newobject);
			$http.post("http://localhost:3000/kpi/insertView",dataToSend )
				.then(function(response) {
				
					});
		}
	});
	//console.log($scope.checkedequipmentList);
	$scope.checkedequipment= [];
}; 

$scope.deleteElement = function(indexNumber,equipmentname, kpiName) {
		$scope.checkedequipmentList.splice(indexNumber,1); 
		var dataForDelete={
						'deleteEquipment': equipmentname,
						'deleteXML': kpiName
					};
		$http.post("http://localhost:3000/kpi/deleteView",dataForDelete )
				.then(function(response) {
				
					});
		if($scope.equ== equipmentname){
 		document.getElementById('mychart').style.display = 'none';
		$scope.equ="";
		$scope.xmlFile1 = "";
		$scope.xmlFileName1 = "";
		$scope.Formula="";
		$scope.Trend="";
		
		}	
};

$scope.openXml = function(xmlFile) {
        document.getElementById("myModal").style.display="block";
		document.getElementById("xml-content").style.display="none";
		 document.getElementById("robots-boxes").style.display="none";
        document.getElementById("xml-content").textContent=$scope.xmlFile;
		$scope.xmlFile = xmlFile;
        $scope.xmlFileName = xmlFile;
		$http.get(url + "readXmlFile/" + xmlFile)
		.then(function(response) {
		$scope.xmlFile = response.data;
		document.getElementById("xml-content").textContent=$scope.xmlFile;
				});
};
$scope.openXml1 = function(xmlFile) {
	$scope.xmlFileName1=xmlFile;
		$http.get(url + "readXmlFile/" + xmlFile).then(function(response) {
			if(response.data){
			if (document.implementation && document.implementation.createDocument) {
                   $scope.xmlFile1  = new DOMParser().parseFromString(response.data, 'text/xml');
				   //console.log($scope.xmlFile1 );
		$scope.Formula=$scope.xmlFile1.getElementsByTagName("Formula")[0].innerHTML;
		//console.log($scope.Formula);
		$scope.Trend=$scope.xmlFile1.getElementsByTagName("Trend")[0].innerHTML;
		console.log($scope.Trend);
                }
                else if (window.ActiveXObject) {
                   $scope.xmlFile1 = new ActiveXObject("Microsoft.XMLDOM");
                   $scope.xmlFile1.loadXML(response.data);
				   
		$scope.Formula=$scope.xmlFile1.getElementsByTagName("Formula")[0].innerHTML;
		
		$scope.Trend=$scope.xmlFile1.getElementsByTagName("Trend")[0].innerHTML;
		
                }
                else
                {
                    alert('Your browser cannot handle this XML');
                    return null;
                }
			}
			else {
                    alert('No xml exists for this KPI');
                    
                }
		
				});
};

$scope.close_dialog = function() {
        document.getElementById("myModal").style.display="none";
		 document.getElementById("exampleModalLong").style.display="none";
};
$scope.new_form = function() {
saveformFlag=false;
		 document.getElementById("exampleModalLong").style.display="block";
};
$scope.view_xml = function() {
        document.getElementById("xml-content").style.overflow = "auto";
        document.getElementById("xml-content").style.display="block";
       //document.getElementById("xml-content").textContent = $scope.xmlFile;
        document.getElementById("robots-boxes").style.display="none";
};

$scope.assign_robot = function() {
       // document.getElementById("xml-content").textContent = "";
         document.getElementById("xml-content").style.display="none";
        document.getElementById("robots-boxes").style.display="block";
};

$scope.display_list = function() {
        document.getElementById("buttons").hidden=true;
        document.getElementById("kpis-list").style.display="block";
};

$scope.visualmode = function(kpi, equipment){
	if (tempoVal) {
			//console.log(tempoProperty);
			
 			$scope.dataInfo(globalData, kpiname, tempoVal, tempoProperty, $scope.visualize)
 		}
};


$scope.showChart = function(viewkpi, equ) {
	$scope.equ=equ;
	var propertName;
var checkvalues = ["Robot", "Conveyor","Production Line"];
var i;
checkvalues.forEach(function (value){
	//console.log(value);
	if(equ.match(value)){
		//console.log("value is ", value);
		if(value=='Robot'){
			propertName = 'hasValue_ROB'+parseInt(equ.replace(value, ""));
			tempoProperty=propertName;
			//console.log("propertyname is ");
			//console.log(propertName);
		}
		else if(value=='Conveyor'){
			propertName = 'hasValue_CNV'+parseInt(equ.replace(value, ""));
			//console.log("propertyname is ");
			//console.log(propertName);
			tempoProperty=propertName;
		}
		else{
			propertName = 'hasValue';
			//console.log("propertyname is ");
			//console.log(propertName);
			tempoProperty=propertName;
		}
		// i= parseInt(equ.replace(value, ""));
		
	}
}); 
var id = 'mychart';
 	tempoVal = true;
	kpiname = viewkpi;
 	$scope.dataInfo(globalData, viewkpi, tempoVal,propertName, $scope.visualize);
 	if (document.getElementById(id).style.display == "none") {
 		document.getElementById(id).style.display = 'block';
 	} 
 };
 
$scope.dataInfo = function(message,kpi, j, propertName, visual){
	
	if(visual== 'column'){
		    //var Products_Quality = google.visualization.arrayToDataTable(arr3);
	var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', kpi);
	  data.addColumn('number' );
	  data.addRows(message[kpi][propertName]);
      var options2 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		backgroundColor: 'transparent',
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
		
		colors:['#2E8B57','#FF0000'],
      };
		
		
		var chart2 = new google.visualization.ColumnChart(document.getElementById('piechart'));
 	chart2.draw(data, options2);
	}
	else if (visual== 'line')
	{var newarr=[];
		message[kpi][propertName].forEach(function(each){
			
			newarr.push([each[0], each[1]]);
		});
		var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', kpi);
	  data.addRows(newarr);
      var options4 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		vAxis:{title: kpi, viewWindow: {
          min: 0,
          max: 100
        }},
		backgroundColor: { fill:'transparent' },
		pointSize: 10,
        pointShape: 'circle'
      };
		
		
		var chart4 = new google.visualization.LineChart(document.getElementById('piechart'));
 	chart4.draw(data, options4);
		
	}
	else if(visual== 'pie')
	{
		var ROB_AvailabilityData = google.visualization.arrayToDataTable([
 		['Task', 'Hours per Day'],
 		[kpi, message[kpi][propertName][(message[kpi][propertName].length-1)][1]],
 		['', message[kpi][propertName][(message[kpi][propertName].length-1)][2]]
 	]);
 	var options1 = {
 		title: kpi,
 		is3D: true,
		backgroundColor: 'transparent',
 		 slices: {
 			0: {
 				offset: 0.2
 			} 
 		},
 	};
	
 	var chart1 = new google.visualization.PieChart(document.getElementById('piechart'));
 	chart1.draw(ROB_AvailabilityData, options1);
		
	}
	
	//console.log(message);
	//console.log('*************KPI Name*****************')
//console.log(kpi);
	//console.log("propertyname is ");
	
/* 	
	console.log(propertName);
	console.log(kpi);
	message[kpi].forEach(function(property){
		//console.log(property);
		var key = Object.keys(property);
if(key[0] == propertName){	
	//console.log('properties keys matched');
	if (kpi=='Availability' || kpi=='Allocation-Efficiency' || kpi=='Utilization-Efficiency' ){
 	var ROB_AvailabilityData = google.visualization.arrayToDataTable([
 		['Task', 'Hours per Day'],
 		['Busy', property[propertName]],
 		['Idle', 100 - property[propertName]]
 	]);
 	var options1 = {
 		title: kpi,
 		is3D: true,
		backgroundColor: 'transparent',
 		 slices: {
 			0: {
 				offset: 0.2
 			} 
 		},
 	};
	
 	var chart1 = new google.visualization.PieChart(document.getElementById('piechart'));
 	chart1.draw(ROB_AvailabilityData, options1);
	}
	else if(kpi=='Quality-Ratio')
	{

	
		  /* if (time!=property.hasTime)
		{  
		 //year=i.toString();
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
		time= property.hasTime;
		var datetime= new Date(property.hasTime);
		 datata.push([datetime,property[propertName], 100 - property[propertName]]);
		 } 
 if (datata.length==8){datata.shift();}	   */
	/* var array1= [['Genre','Good Quantity', 'Scrap Quantity', { role: 'annotation' } ]];
		var arr3= array1.concat(datata);
		    //var Products_Quality = google.visualization.arrayToDataTable(arr3);
	var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', 'Good Ratio');
	  data.addColumn('number', 'Scrap Ratio');
	  data.addRows(datata);
      var options2 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
		colors:['#2E8B57','#FF0000'],
      };
		
		
		var chart2 = new google.visualization.ColumnChart(document.getElementById('piechart'));
 	chart2.draw(data, options2);
	}
	else if(kpi=='Scrap-Ratio')
	{

	
		  if ((time1!=property.hasTime))
		{  
		// year1=i.toString();
		time1= property.hasTime;
		var datetime= new Date(property.hasTime);
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
		 datata1.push([datetime,property[propertName]]);
		 
		}
 if (datata1.length==12){datata1.shift();}	  
	var array4= [['Genre','Scrap Quantity', { role: 'annotation' } ]];
		var arr5= array4.concat(datata1);
		    //var Products_Scrap = google.visualization.arrayToDataTable(arr5);
var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', 'Scrap Ratio');
	  data.addRows(datata1);
      var options3 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		vAxis:{title: 'Scrap Ratio', viewWindow: {
          min: 0,
          max: 75
        }},
		pointSize: 10,
        pointShape: 'circle'
      };
		
		
		var chart3 = new google.visualization.LineChart(document.getElementById('piechart'));
 	chart3.draw(data, options3);
	}
	else
	{

	
		  if ((time3!=property.hasTime))
		{  
		// year1=i.toString();
		time3= property.hasTime;
		var datetime= new Date(property.hasTime); */
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
/* 		 datata2.push([datetime,property[propertName]]);
		 
		}
 if (datata2.length==12){datata2.shift();}	  
	var array6= [['Genre','productive', { role: 'annotation' } ]];
		var arr7= array6.concat(datata2);
		    //var Products_Scrap = google.visualization.arrayToDataTable(arr5);
var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', kpi);
	  data.addRows(datata2);
      var options4 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		vAxis:{title: kpi, viewWindow: {
          min: 0,
          max: 100
        }},
		pointSize: 10,
        pointShape: 'circle'
      };
		
		
		var chart4 = new google.visualization.LineChart(document.getElementById('piechart'));
 	chart4.draw(data, options4);
	}
}
	});  */ 
	/* var rob_number = "ROB" + j + "_" + kpi;
 	var ROB_AvailabilityData = google.visualization.arrayToDataTable([
 		['Task', 'Hours per Day'],
 		['Busy', message[kpi][j - 1][rob_number]],
 		['Idle', 100 - message[kpi][j - 1][rob_number]]
 	]);
 	var options1 = {
 		title: rob_number,
 		pieSliceText: 'label',
 		is3D: true,
		backgroundColor: 'transparent',
 		slices: {
 			0: {
 				offset: 0.2
 			}
 		},
 	};
 	var chart1 = new google.visualization.PieChart(document.getElementById('piechart'));
 	chart1.draw(ROB_AvailabilityData, options1); */


 };
 
var init= function()
{
	$http.get("http://localhost:3000/kpi/viewData")
				.then(function(response) {
					$scope.checkedequipmentList = response.data;
		
		
				});
}

init();
$scope.loadData();

});

/* PREFIX test: <http://www.semanticweb.org/muhammad/ontologies/2017/2/untitled-ontology-14#>

DELETE
  {
  ?b  test:Kpi_Variable ?s ;
      test:hasValue_ROB1 ?p ;
      test:hasTime ?t .
  }
WHERE
  {
  ?b  test:Kpi_Variable ?s ;
      test:hasValue_ROB1 ?p ;
      test:hasTime ?t .
  FILTER (?t < now())
  FILTER (isBlank(?b))
  # ...
  VALUES (?s) { (test:Actual_Production_Time) }
  } */