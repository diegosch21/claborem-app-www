'use strict';

angular.module('myApp.login', []).controller('loginCtrl', ['$scope', 'ApiHttpSrv', 'ConfigSrv', '$rootScope', 'AuthSrv', '$location',function($scope, ApiHttpSrv, ConfigSrv, $rootScope, AuthSrv, $location) {

    if (AuthSrv.authorized() && !AuthSrv.initialState()) {
       $location.path("/home");
    }
    $scope.loginfail = false;

	$scope.login = function (user) {
        var data = {
        	"user": $scope.user.name,
        	"pass": $scope.user.password
        };
        AuthSrv.login(data);
        console.log(!AuthSrv.isLoggedIn());
        $scope.loginfail = !AuthSrv.isLoggedIn();     
    }

}]);