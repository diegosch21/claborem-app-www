'use strict';

angular.module('myApp.main', []).controller('mainCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


    $rootScope.plant = {};
    var getdata = function () {
        var data = {
            'User': '',
            'Token': ''
        };
        var getDataSuccess = function(data){
            $rootScope.data = data;
            $rootScope.currentId = data.plantas.default;
            $rootScope.plant = data.plantas.lista[$rootScope.currentId];
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
    
    $rootScope.logout = function () {
        AuthSrv.logout();
    }
    $rootScope.changePlant = function(id){
        $rootScope.currentId = id;
        $rootScope.plant = $scope.data.plantas.lista[id];
    }

    $scope.goToContracts = function(){
        RedirectSrv.redirect('/contracts');
    }

    $scope.goToHome = function(){
        RedirectSrv.redirect('/');
    }

    $scope.collapse = function(id){
        $('#' + id).removeClass('in');
        $('#' + id).addClass('collapse');
    }

    $scope.goToWorkForce = function(){
        RedirectSrv.redirect('/workforce');
    }


}]);