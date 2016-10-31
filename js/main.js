'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'AppConfig',
        'myApp.filters',
        'myApp.directives', // custom directives
        'myApp.home',
        'myApp.homePlanta',
        'myApp.collections',
        'myApp.collectionsPlanta',
        'myApp.entity',
        'myApp.entityPlanta',
        'myApp.reportes',
        'myApp.main',
        'myApp.login',
        'myApp.services',
        // 'ngGrid', // angular grid
        // 'ui', // angular ui
        // 'ngSanitize', // for html-bind in ckeditor
        // 'ui.bootstrap', // jquery ui bootstrap
        // '$strap.directives' // angular strap

    ]);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);

// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    // TODO use html5 *no hash) where possible
    // $locationProvider.html5Mode(true);

    $routeProvider.when('/login', {
        templateUrl:'views/login/login.html',
        controller: 'loginCtrl'
    });

//------------------------ CONTRATISTA --------------------------

    $routeProvider.when('/', {
        templateUrl:'views/contratista/home/home.html',
        controller: 'homeCtrl'
    });

    $routeProvider.when('/contratos', {
        templateUrl:'views/contratista/contracts/contratos.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'contratos',
                sortingOrder : 'Numero'
            }; }
        }
    });

    $routeProvider.when('/contrato/:idP/:id', {
        templateUrl:'views/contratista/contracts/contrato.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'contrato'
            }; }
        }
    });

    $routeProvider.when('/contratistas', {
        templateUrl:'views/contratista/contratistas/contratistas.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'contratistas',
                sortingOrder : 'RazonSocial'
            }; }
        }
    });

    $routeProvider.when('/contratista/:idP/:id', {
        templateUrl:'views/contratista/contratistas/contratista.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'contratista'
            }; }
        }
    });

    $routeProvider.when('/personal', {
        templateUrl:'views/contratista/personal/personal.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'personal',
                sortingOrder : 'Apellido'
            }; }
        }
    });

    $routeProvider.when('/empleado/:idP/:id', {
        templateUrl:'views/contratista/personal/empleado.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'empleado'
            }; }
        }
    });

    $routeProvider.when('/vehiculos', {
        templateUrl:'views/contratista/vehiculos/vehiculos.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculos',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/vehiculo/:idP/:id', {
        templateUrl:'views/contratista/vehiculos/vehiculo.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculo'
            }; }
        }
    });

    $routeProvider.when('/maquinarias', {
        templateUrl:'views/contratista/maquinarias/maquinarias.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinarias',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/maquinaria/:idP/:id', {
        templateUrl:'views/contratista/maquinarias/maquinaria.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinaria'
            }; }
        }
    });

    $routeProvider.when('/reportes', {
        templateUrl:'views/contratista/reportes/reportes.html', // controller indicado via ng-controller
    });

//------------------------------ PLANTA --------------------------
    
    $routeProvider.when('/homePlanta', {
        templateUrl:'views/planta/homePlanta/homePlanta.html',
        controller: 'homePlantaCtrl'
    });

    $routeProvider.when('/contratosPlanta', {
        templateUrl:'views/planta/contracts/contratosPlanta.html',
        controller: 'collectionsPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'contratosPlanta',
                sortingOrder : 'Numero'
            }; }
        }
    });

    $routeProvider.when('/contratoPlanta/:id', {
        templateUrl:'views/planta/contracts/contratoPlanta.html',
        controller: 'entityPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'contratoPlanta'
            }; }
        }
    });

    $routeProvider.when('/contratistasPlanta', {
        templateUrl:'views/planta/contratistas/contratistasPlanta.html',
        controller: 'collectionsPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'contratistasPlanta',
                sortingOrder : 'RazonSocial'
            }; }
        }
    });

    $routeProvider.when('/contratistaPlanta/:id', {
        templateUrl:'views/planta/contratistas/datosContratistaPlanta.html',
        controller: 'entityPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'contratistaPlanta'
            }; }
        }
    });

    $routeProvider.when('/personalPlanta', {
        templateUrl:'views/planta/personal/personalPlanta.html',
        controller: 'collectionsPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'personalPlanta',
                sortingOrder : 'Apellido'
            }; }
        }
    });

    $routeProvider.when('/empleadoPlanta/:id', {
        templateUrl:'views/planta/personal/datosEmpleadoPlanta.html',
        controller: 'entityPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'empleadoPlanta'
            }; }
        }
    });

    $routeProvider.when('/vehiculosPlanta', {
        templateUrl:'views/planta/vehiculos/vehiculosPlanta.html',
        controller: 'collectionsPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculosPlanta',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/vehiculoPlanta/:id', {
        templateUrl:'views/planta/vehiculos/datosVehiculoPlanta.html',
        controller: 'entityPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculoPlanta'
            }; }
        }
    });

    $routeProvider.when('/maquinariasPlanta', {
        templateUrl:'views/planta/maquinarias/maquinariasPlanta.html',
        controller: 'collectionsPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinariasPlanta',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/maquinariaPlanta/:id', {
        templateUrl:'views/planta/maquinarias/datosMaquinariaPlanta.html',
        controller: 'entityPlantaCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinariaPlanta'
            }; }
        }
    });

    $routeProvider.when('/reportesPlanta', {
        templateUrl:'views/planta/reportes/reportesPlanta.html', // controller indicado via ng-controller
    });
    
    // by default, redirect to site root
    $routeProvider.otherwise({
        redirectTo:'/'
    });

}]);

// this is run after angular is instantiated and bootstrapped
myApp.run(function ($rootScope, $location, $http, $timeout, AuthSrv, RedirectSrv) {

    // *****
    // Initialize authentication
    // *****
    $rootScope.authService = AuthSrv;

    $rootScope.$watch('authService.authorized()', function () {

        // if never logged in, do nothing (otherwise bookmarks fail)
        if (AuthSrv.initialState()) {
            // we are public browsing
            RedirectSrv.redirect('/login');
            return;
        }

        // when user logs in, redirect to home
        if (AuthSrv.authorized()) {
            //$location.path("/"); // in mainCtrl
        }

        // when user logs out, redirect to login
        if (!AuthSrv.authorized()) {
            RedirectSrv.redirect('/login');
        }
    }, true);


});