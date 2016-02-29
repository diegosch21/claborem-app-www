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
        $rootScope.collections = {}; // destruyo las colecciones (para prevenir errores con back button)
        RedirectSrv.redirect('/');
    }

    $scope.goToContratos = function(){
        RedirectSrv.redirect('/contratos');
    }

    $scope.goToContratoPage = function(id){
        RedirectSrv.redirect('/contrato/' + id);
    }

    $scope.goToContratistas = function(){
        RedirectSrv.redirect('/contratistas');
    }

    $scope.goToContratistaPage = function(id){
        RedirectSrv.redirect('contratista/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToPersonal = function(){
        RedirectSrv.redirect('/personal');
    }

    $scope.goToEmpleadoPage = function(id){
        RedirectSrv.redirect('empleado/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToMaquinarias = function(){
        RedirectSrv.redirect('/maquinarias');
    }

    $scope.goToMaquinariaPage = function(id){
        RedirectSrv.redirect('maquinaria/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToVehiculos = function(){
        RedirectSrv.redirect('/vehiculos');
    }

    $scope.goToVehiculoPage = function(id){
        RedirectSrv.redirect('vehiculo/' + $rootScope.plant.id + '/' + id);
    }


    $rootScope.goBack = function(){
        $window.history.back();
    }

    $rootScope.goToHome = function(){
        // $rootScope.updateHome = true;  // si aprieto inicio actualiza la home
        RedirectSrv.redirect('/');
    }

    $scope.collapse = function(id){
        $('#' + id).removeClass('in');
        $('#' + id).addClass('collapse');
    }

}]);