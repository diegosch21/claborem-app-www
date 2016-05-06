'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'AppConfig',
        'myApp.filters',
        'myApp.directives', // custom directives
        'myApp.home',
        'myApp.collections',
        'myApp.entity',
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

    $routeProvider.when('/', {
        templateUrl:'views/home/home.html',
        controller: 'homeCtrl'
    });

    $routeProvider.when('/login', {
        templateUrl:'views/login/login.html',
        controller: 'loginCtrl'
    });

    $routeProvider.when('/contratos', {
        templateUrl:'views/contracts/contratos.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'contratos',
                sortingOrder : 'Numero'
            }; }
        }
    });

    $routeProvider.when('/contrato/:idP/:id', {
        templateUrl:'views/contracts/contrato.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'contrato'
            }; }
        }
    });

    $routeProvider.when('/contratistas', {
        templateUrl:'views/contratistas/contratistas.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'contratistas',
                sortingOrder : 'RazonSocial'
            }; }
        }
    });

    $routeProvider.when('/contratista/:idP/:id', {
        templateUrl:'views/contratistas/contratista.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'contratista'
            }; }
        }
    });

    $routeProvider.when('/personal', {
        templateUrl:'views/personal/personal.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'personal',
                sortingOrder : 'Apellido'
            }; }
        }
    });

    $routeProvider.when('/empleado/:idP/:id', {
        templateUrl:'views/personal/empleado.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'empleado'
            }; }
        }
    });

    $routeProvider.when('/vehiculos', {
        templateUrl:'views/vehiculos/vehiculos.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculos',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/vehiculo/:idP/:id', {
        templateUrl:'views/vehiculos/vehiculo.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'vehiculo'
            }; }
        }
    });

    $routeProvider.when('/maquinarias', {
        templateUrl:'views/maquinarias/maquinarias.html',
        controller: 'collectionsCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinarias',
                sortingOrder : 'Marca'
            }; }
        }
    });

    $routeProvider.when('/maquinaria/:idP/:id', {
        templateUrl:'views/maquinarias/maquinaria.html',
        controller: 'entityCtrl',
        resolve: {
            context: function() { return {
                type: 'maquinaria'
            }; }
        }
    });

    $routeProvider.when('/reportes', {
        templateUrl:'views/reportes/reportes.html', // controller indicado via ng-controller
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