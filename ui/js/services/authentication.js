'use strict';

angular.module('myApp.services').service('AuthSrv', function ($http, ConfigSrv, ApiHttpSrv) {
    var currentUser = null;
    var authorized = false;
    var initialState = true;

    var initialState = function () {
        return initialState;
    };
    var login = function (data) {
        var loginSuccess = function(data){
            if(data[0].Estado === 'ok'){
                currentUser = {
                    type : data[0].tipo,
                    token : data[0].token
                };
                authorized = true;
                initialState = false;
            }
        };
        var loginFail = function(data){
            console.log(data);
        };
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('login'), data).success(loginSuccess).error(loginFail);
    };
    var logout = function () {
        var logoutSuccess = function(data){
            currentUser = null;
            authorized = false;
        };
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('logout'), []).success(logoutSuccess);
    };
    var isLoggedIn = function () {
        return authorized;
    };
    var currentUser = function () {
        return currentUser;
    };
    var authorized = function () {
        return authorized;
    };

    //return service
    return {
        initialState: initialState,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        authorized: authorized
    };
});