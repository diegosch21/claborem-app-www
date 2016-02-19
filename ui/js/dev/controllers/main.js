'use strict';

angular.module('myApp.main', []).controller('mainCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


    $rootScope.plant = {};


    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path("/login");
    }else{
        RedirectSrv.redirect('/');
    }

    $rootScope.logout = function () {
        AuthSrv.logout();
    }
    $rootScope.changePlant = function(id){
        $rootScope.currentId = id;
        $rootScope.plant = $rootScope.plantas[id];
        RedirectSrv.redirect('/');
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