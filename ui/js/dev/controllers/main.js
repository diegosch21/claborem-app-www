'use strict';

angular.module('myApp.main', [])
    .controller('mainCtrl',
        ['$scope', '$rootScope', '$window', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',
        function($scope, $rootScope, $window, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


    $rootScope.plant = {};


    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path("/login");
    }else{
        $rootScope.updateHome = true; // inicialmente debo actualizar la home
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
        $rootScope.updateHome = true;  // si aprieto inicio actualiza la home
        RedirectSrv.redirect('/');
    }

    $scope.collapse = function(id){
        $('#' + id).removeClass('in');
        $('#' + id).addClass('collapse');
    }

    $scope.goToWorkForce = function(){
        RedirectSrv.redirect('/workforce');
    }

    $rootScope.goBack = function(){
        $window.history.back();
    }

}]);