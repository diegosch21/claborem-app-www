'use strict';

angular.module('myApp.worker', []).controller('workerCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'Token': '',
            'Id': $routeParams.id
        };
        var getDataSuccess = function(data){
            $scope.workerData = data;
            console.log(data);
        };
        var getDataFail = function(data){
            console.log(data);
        };
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('worker'), data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }

}]);