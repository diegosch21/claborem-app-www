'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'AppConfig',
        'myApp.filters',
        'myApp.directives', // custom directives
        'myApp.home',
        'myApp.contracts',
        'myApp.workforce',
        'myApp.main',
        'myApp.login',
        'myApp.services',
        'ngGrid', // angular grid
        'ui', // angular ui
        'ngSanitize', // for html-bind in ckeditor
        'ui.bootstrap', // jquery ui bootstrap
        '$strap.directives' // angular strap
        
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

    $routeProvider.when('/contracts', {
        templateUrl:'views/contracts/contracts.html'
    });

    $routeProvider.when('/workforce', {
        templateUrl:'views/workforce/workforce.html'
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
            //$location.path("/");
        }

        // when user logs out, redirect to login
        if (!AuthSrv.authorized()) {
            RedirectSrv.redirect('/login');
        }
    }, true);

});