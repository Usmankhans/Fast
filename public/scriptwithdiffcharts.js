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
		$scope.visualize = "pie";
		var globalData;
		var tempoVal;
		var tempoProperty;
		var kpiname;
		var datata=[];
		var datata1=[];
		var time;
		var time1;
		var previousKPI;
		var previousProperty;
			var i=2010;
				var year;
				var year1;
		$scope.selectRob = [];
		$rootScope.Utils = {
     keys : Object.keys
  }
  kpiSocket.on('test', function(msg) {
console.log('I got KPINew');
 	globalData = msg;
 	var message = msg;
	//console.log(msg);
	google.charts.load('current', {
 		'packages': ['corechart']
 	});
 	google.charts.setOnLoadCallback(function() {

 		//console.log(message);
 		if (tempoVal) {
			//console.log(tempoProperty);
			//console.log(kpiname);
 			$scope.dataInfo(message, kpiname, tempoVal, tempoProperty, $scope.visualize)
 		}

 	});
 });
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
          $http.get(url + "getXmlList")
				.then(function(response) {
					$scope.xmlList = response.data.data;
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
              
		
				});
};

$scope.close_dialog = function() {
        document.getElementById("myModal").style.display="none";
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


$scope.visualmode=function() {
	if (tempoVal) {
			//console.log(tempoProperty);
			
 			$scope.dataInfo(globalData, kpiname, tempoVal, tempoProperty, $scope.visualize)
 		}
		console.log($scope.visualize);
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
 
$scope.dataInfo = function(message,kpi, j, propertName, visualize){
	console.log('*************visualize Name*****************')
	console.log(visualize);
	//console.log('*************KPI Name*****************')
//console.log(kpi);
	//console.log("propertyname is ");
	//console.log(propertName);
	console.log(kpi);
	message[kpi].forEach(function(property){
		//console.log(property);
		var key = Object.keys(property);
if(key[0] == propertName){	

	console.log('properties keys matched');
	console.log(previousKPI);
	console.log(kpi);
	if (visualize=='pie' ){
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
	else if(visualize=='column' )
	{
if (previousKPI != kpi || previousProperty!=propertName)
{
		console.log(previousKPI);
	console.log(kpi);
	datata=[];
	time1= property.hasTime;
		var datetime= new Date(property.hasTime);
	datata=[[datetime,property[propertName]]];
}
	
		  if (time1!=property.hasTime)
		{  
		 //year=i.toString();
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
		time1= property.hasTime;
		var datetime= new Date(property.hasTime);
		 datata.push([datetime,property[propertName]]);
		 } 
 if (datata.length==8){datata.shift();}	  
	var array1= [['Genre','Good Quantity', { role: 'annotation' } ]];
		var arr3= array1.concat(datata);
		    //var Products_Quality = google.visualization.arrayToDataTable(arr3);
	var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', kpi);
	  data.addRows(datata);
      var options2 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		vAxis:{ viewWindow: {
          min: 0,
          max: 100
        }},
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
		colors:['#2E8B57','#FF0000'],
      };
		
		
		var chart2 = new google.visualization.ColumnChart(document.getElementById('piechart'));
 	chart2.draw(data, options2);
	}
	else if(visualize=='line')
	{
if (previousKPI != kpi || previousProperty!=propertName)
{
	console.log(previousKPI);
	console.log(kpi);
	console.log('i cleaned the Line ')
	datata=[];
	time1= property.hasTime;
		var datetime= new Date(property.hasTime);
datata=[[datetime,property[propertName]]];
}
	
		  if (time1!=property.hasTime)
		{  
		// year1=i.toString();
		time1= property.hasTime;
		var datetime= new Date(property.hasTime);
		//var datata=[[ i, property[propertName], 100 - property[propertName], '']];
		 datata.push([datetime,property[propertName]]);
		}
 if (datata.length==12){datata.shift();}	  
	var array4= [['Genre','Scrap Quantity', { role: 'annotation' } ]];
		var arr5= array4.concat(datata);
		    //var Products_Scrap = google.visualization.arrayToDataTable(arr5);
var data=new google.visualization.DataTable();
	 data.addColumn('datetime', 'Day');
      data.addColumn('number', kpi);
	  data.addRows(datata);
      var options3 = {
		  hAxis: {
          title: 'Time',
           format: 'hh:mm:ss',
        },
		vAxis:{title: 'unProductive', viewWindow: {
          min: 0,
          max: 100
        }},
		pointSize: 10,
        pointShape: 'circle'
      };
		
		
		var chart3 = new google.visualization.LineChart(document.getElementById('piechart'));
 	chart3.draw(data, options3);
	}
}
	}); 
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

previousKPI= kpi;
previousProperty= propertName;
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