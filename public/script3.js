angular.module('kpi', [])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('//');
		$interpolateProvider.endSymbol('//');
	})
	.controller('kpiCtrl', function($scope, $http, $timeout, $filter, kpiSocket,$rootScope) {
		 $scope.checkedequipment = [];
		  $scope.checkedequipment1 = [];
		 $scope.checkedequipmentList = [];
		$scope.xmlList = {};
		$scope.xmlFile = "";
      	$scope.xmlFileName = "";
		var globalData;
		var tempoVal;
		var kpiname;
		$scope.selectRob = [];
		$rootScope.Utils = {
     keys : Object.keys
  }
  kpiSocket.on('test', function(msg) {

 	globalData = msg;
 	var message = msg;
	//console.log(message);
	google.charts.load('current', {
 		'packages': ['corechart']
 	});
 	google.charts.setOnLoadCallback(function() {

 		//console.log(message);
 		if (tempoVal) {
 			$scope.dataInfo(message, kpiname, tempoVal)
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

$scope.getEquipmentlist = function() {
          $http.get(url + "/assign-Equipment/xml")
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
            console.log($scope.xmlFileName);
			console.log($scope.checkedequipment);
        } else {
            $scope.checkedequipment.splice($scope.checkedequipment.indexOf(equipment), 1);
        }
};


$scope.toggleCheck1 = function (equipment) {
        if ($scope.checkedequipment1.indexOf(equipment) === -1) {
            $scope.checkedequipment1.push(equipment);
			console.log($scope.checkedequipment1);
        } else {
            $scope.checkedequipment1.splice($scope.checkedequipment1.indexOf(equipment), 1);
			console.log($scope.checkedequipment1);
        }
};

$scope.deleteData=function (equipment) {
      console.log($scope.checkedequipment1);
	  $http.post("http://localhost:3000/kpi/deleteData",$scope.checkedequipment1 )
				.then(function(response) {
					console.log(response);
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
					console.log(equipment);
					
					$http.post("http://localhost:3000/kpi/insertView",dataToSend )
				.then(function(response) {
					console.log(response);
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
					console.log(response);
					});
		}
	});
	console.log($scope.checkedequipmentList);
	$scope.checkedequipment= [];
}; 

$scope.deleteElement = function(indexNumber,equipmentname) {
		$scope.checkedequipmentList.splice(indexNumber,1); 
		if($scope.equ== equipmentname){
 		document.getElementById('mychart').style.display = 'none';
		}	
};

$scope.openXml = function(xmlFile) {
        document.getElementById("myModal").style.display="block";
        document.getElementById("xml-content").textContent=$scope.xmlFile;
		$scope.xmlFile = xmlFile;
        $scope.xmlFileName = xmlFile;
		$http.get(url + "readXmlFile/" + xmlFile)
		.then(function(response) {
		$scope.xmlFile = response.data.data;
		document.getElementById("xml-content").textContent=$scope.xmlFile;
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

$scope.visualize = function(kpi, equipment){
	console.log("Kpi", kpi);
	console.log("equipment", equipment);
};


$scope.showChart = function(viewkpi, equ) {
	$scope.equ=equ;
var checkvalues = ["Robot", "Conveyor"];
var i;
checkvalues.forEach(function (value){
	console.log(value);
	if(equ.match(value)){
		console.log("value is ", value);
		 i= parseInt(equ.replace(value, ""));
		
	}
}); 
var id = 'mychart';
 	tempoVal = i;
	kpiname = viewkpi;
 	$scope.dataInfo(globalData, viewkpi, i);
 	if (document.getElementById(id).style.display == "none") {
 		document.getElementById(id).style.display = 'block';
 	} 
 };
 
$scope.dataInfo = function(message,kpi, j){
	console.log(kpi);
	var rob_number = "ROB" + j + "_" + kpi;
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
 	chart1.draw(ROB_AvailabilityData, options1);


 };
 
var init= function()
{
	$http.get("http://localhost:3000/kpi/viewData")
				.then(function(response) {
					$scope.checkedequipmentList = response.data;
		console.log(response.data);
		
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