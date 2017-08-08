angular.module('kpi')
.factory('kpiSocket', function ($rootScope) {
  //var kpiSocket = io.connect('http://localhost:3001');
 var KPI = io.connect('http://localhost:3003');
 var HostName = "http://localhost:3000";
  return {
    on: function (eventName, callback) {
      KPI.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(KPI, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      KPI.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(KPI, args);
          }
        });
      })
    }
  };
});