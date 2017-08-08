angular.module('kpi', ['LocalStorageModule'])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('//');
		$interpolateProvider.endSymbol('//');
	})
	.controller('kpiCtrl', function($scope, $http, $timeout, localStorageService, $filter) {
		$scope.xmlList = {};
		$scope.xmlFile = "";
      	$scope.xmlFileName = "";
		$scope.selectRob = [];
		//$scope.equipmentlist = ["Robot 1", "Robot 2", "Robot 3", "Robot 4", "Robot 5", "Robot 6", "Robot 8", "Robot 9", "Robot 10", "Robot 11", "Robot 12"];
		//$scope.robotMapp =["abc.xml  :  ROBOT-2", "abc.xml  :  ROBOT-3"];
      	$scope.robotMapp = JSON.parse(localStorage.getItem("robots-array"));
      	localStorage.setItem("robots-array", JSON.stringify([]));

		var url = "http://localhost:3000/kpiValue/";
		$scope.equipment = [{
			name: "Robot 1",
			status: 0
		}, {
			name: "Robot 2",
			status: 0
		}, {
			name: "Robot 3",
			status: 0
		}, {
			name: "Robot 4",
			status: 0
		}, {
			name: "Robot 5",
			status: 0
		}, {
			name: "Robot 6",
			status: 0
		}, {
			name: "Robot 7",
			status: 0
		}, {
			name: "Robot 8",
			status: 0
		}, {
			name: "Robot 9",
			status: 0
		}, {
			name: "Robot 10",
			status: 0
		}];

		$scope.loadData = function() {
          $http.get(url + "getXmlList")
				.then(function(response) {
					$scope.xmlList = response.data.data;

				});
			};
		$scope.getEquipmentlist = function(xml) {
          $http.get(url + "/assign-Equipment/xml")
				.then(function(response) {
					$scope.equipmentlist = response.data;

				});

		};
      	$scope.loadRobots = function () {
			//$scope.robotMapp.length = 0;
          $scope.robotMapp = JSON.parse(localStorage.getItem("robots-array"));
		  console.log($scope.robotMapp);
        };
$scope.delete = function(indexNumber) {
	$scope.robotMapp.splice(indexNumber,1); 
         console.log(indexNumber);
		 console.log($scope.robotMapp);

      };
		$scope.openXml = function(xmlFile) {
          	document.getElementById("myModal").style.display="block";
          	document.getElementById("xml-content").textContent="";
			$scope.xmlFile = xmlFile;
          	$scope.xmlFileName = xmlFile;
			$http.get(url + "readXmlFile/" + xmlFile)
				.then(function(response) {
					$scope.xmlFile = response.data.data;
                  	localStorage.xmlFile = $scope.xmlFile;
                  	localStorage.xmlFileName = $scope.xmlFileName;
                  	$scope.selectRob = localStorageService.get($scope.xmlFile);
					$scope.toggleAll();
				});

		};

      $scope.close_dialog = function() {
        document.getElementById("myModal").style.display="none";

      };
      $scope.view_xml = function() {

        document.getElementById("xml-content").style.overflow = "auto";
        document.getElementById("xml-content").textContent = localStorage.xmlFile;
        document.getElementById("robots-boxes").style.display="none";
      };

      $scope.save_robot = function() {
      	var a= true;
      	var x=1;
      	var robot_mapping = [];
      	var mapp = {};
      	var fileName = localStorage.xmlFileName.toString();
      	while (a== true){
      		var id ="checkbox-" + x;
          	var box = document.getElementById(id);
          	if (box == undefined){
          		a=false;
			}
			else{
				x += 1;
				if (box.checked){
					robot_mapping.push(id);
			}}
		}
		mapp[fileName] = robot_mapping;
        var robots = JSON.parse(localStorage.getItem("robots-array"));
        robot_mapping.forEach(function (value) {
		  robots.push(fileName +"  :  "+ value.replace("checkbox", "ROBOT"));
          $scope.robotMapp.push(fileName +"  :  "+ value.replace("checkbox", "ROBOT"));

        });
        localStorage.setItem("robots-array", JSON.stringify(robots));

      };


      $scope.assign_robot = function() {
        document.getElementById("xml-content").textContent = "";
        document.getElementById("robots-boxes").style.display="block";


      };

      $scope.display_list = function() {
        document.getElementById("buttons").hidden=true;
        document.getElementById("kpis-list").style.display="block";
      };

		$scope.toggleAll = function() {
			$timeout(function() {
				var toggleStatus = 0; //!$scope.isAllSelected;
				angular.forEach($scope.equipment, function(itm) {
					itm.status = toggleStatus;

					if ($scope.selectRob && angular.isDefined($scope.selectRob.selectVal)) {
						var found = _.find($scope.selectRob.selectVal, function(num) {
							return num.name == itm.name;
						});
						
						if(found && angular.isDefined(found.name)){
							itm.status = 1;
							console.log(found,itm);
						}
						
					}
						

				});
				//console.log($scope.equipment);
			}, 0);
		};

		$scope.saveValue = function() {
			$timeout(function() {
				var chkValue = [];
				angular.forEach($scope.equipment, function(itm) {
					if (itm.status) {
						chkValue.push(itm);
					}

				});
				localStorageService.set($scope.xmlFile, {
					selectVal: chkValue
				});

			}, 0);
		}
		$scope.loadData();
      	$scope.loadRobots();
	}).filter('findobj', function() {

		return function(list, obj) {

			return list.filter(function(l) {
				if (obj.indexOf(l.name) >= 0) {
					return true;
				}
			});

		};
	});