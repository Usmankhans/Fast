angular.module('kpi', ['LocalStorageModule'])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('//');
		$interpolateProvider.endSymbol('//');
	})
	.controller('kpiCtrl', function($scope, $http, $timeout, localStorageService, $filter) {
		$scope.xmlList = {};
		$scope.xmlFile = "";
		$scope.selectRob = [];

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

		$scope.openXml = function(xmlFile) {
			$scope.xmlFile = xmlFile;
			$http.get(url + "readXmlFile/" + xmlFile)
				.then(function(response) {
					$scope.xmlFile = response.data.data;
					$scope.selectRob = localStorageService.get($scope.xmlFile);
					$scope.toggleAll();
				});

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
	}).filter('findobj', function() {

		return function(list, obj) {

			return list.filter(function(l) {
				if (obj.indexOf(l.name) >= 0) {
					return true;
				}
			});

		};
	});