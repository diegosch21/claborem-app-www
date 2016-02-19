'use strict';

angular.module('myApp.home', []).controller('homeCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {

    $rootScope.plant = {};
    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token
        };
        var getDataSuccess = function(data){
            console.log(data[0]);
            $rootScope.data = data[0];
            $rootScope.plantas = $rootScope.data.plantas;

            $rootScope.currentId = 0
            $rootScope.plant = $rootScope.data.plantas[$rootScope.currentId];
        };
        var getDataFail = function(data){
            console.log(data);
        };
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('home'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path('/login');
    }else{
        getdata();
    }

}]);