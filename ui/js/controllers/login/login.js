'use strict';

angular.module('myApp.login', []).controller('loginCtrl', ['$scope', 'ApiHttpSrv', 'ConfigSrv', '$rootScope', 'AuthSrv', '$location',function($scope, ApiHttpSrv, ConfigSrv, $rootScope, AuthSrv, $location) {

    if (AuthSrv.authorized() && !AuthSrv.initialState()) {
       $location.path("/home");
    }

	$scope.login = function (user) {
        var data = {
        	'User': $scope.user.name,
        	'Password': $scope.user.password
        };
        AuthSrv.login(data);        
    }

}]);