// angular.module('Example', [])
// .controller('FetchC', ['$scope', '$http',
//  function($scope, $http) {
//   $scope.method = 'GET';
//    $scope.url = 'sample.xml';
//  $scope.bring = function(){
//  $http.get("http://localhost:3000/public/sample.xml")
//   .then(function(response) {
//       $scope.Welcome = response.data;
//      console.log(response.data);
//      console.log($scope.Welcome);
//   });
//    // response.error(function(data, status, headers, config) {
//    //          alert("Error.");
//    //      });
// };
// }]);


$(func
   $('#get-xml').on('click', function() {
        $.ajax({tion() {
   $('#get-button').on('click', function() {
        $.ajax({
            url: 'http://localhost:3000/kpiValue/list',
            contentType: 'application/json',
            success: function(response) {
                var tbodyEl = $('tbody');
                console.log(response);  
            }
        });
    });

            url: 'http://localhost:3000/kpiValue/sample',
            contentType: 'application/json',
            success: function(response) {
                var tbodyEl = $('tbody');
                console.log(response);  
            }
        });
    });

  $('#get-equipment').on('click', function() {
        $.ajax({
            url: 'http://localhost:3000/kpiValue/assign-Equipment',
            contentType: 'application/json',
            success: function(response) {
                var tbodyEl = $('tbody');
                console.log(response);  
            }
        });
    });

});