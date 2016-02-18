'use strict';

angular.module('myApp.main', []).controller('mainCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


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
        $location.path("/login");
    }else{
        getdata();
    }
    
    $rootScope.logout = function () {
        AuthSrv.logout();
    }
    $rootScope.changePlant = function(id){
        $rootScope.currentId = id;
        $rootScope.plant = $rootScope.plantas[id];
    }

    $scope.goToContracts = function(){
        RedirectSrv.redirect('/contracts');
    }

    $scope.goToMaquinarias = function(){
        RedirectSrv.redirect('/maquinarias');
    }


    $scope.goToVehiculos = function(){
        RedirectSrv.redirect('/vehiculos');
    }

    $scope.goToContratistas = function(){
        RedirectSrv.redirect('/contratistas');
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