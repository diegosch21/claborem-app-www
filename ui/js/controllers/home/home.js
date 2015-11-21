'use strict';

angular.module('myApp.home', []).controller('homeCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv) {


    $scope.plant = {};
    var getdata = function () {
        var data = {
            'User': '',
            'Token': ''
        };
        var getDataSuccess = function(data){
            $scope.data = data;
            $scope.currentId = data.plantas.default;
            $scope.plant = data.plantas.lista[$scope.currentId];
        };
        var getDataFail = function(data){
            console.log(data);
        };
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('home'), data).success(getDataSuccess).error(getDataFail);
    }

	if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path("/login");
    }else{
        getdata();
    }
    
    $scope.logout = function () {
        AuthSrv.logout();
    }
    $scope.changePlant = function(id){
        $scope.currentId = id;
        $scope.plant = $scope.data.plantas.lista[id];
    }


}]);