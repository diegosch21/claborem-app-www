'use strict';

angular.module('myApp.services').service('AuthSrv', function ($http, $rootScope, ConfigSrv, ApiHttpSrv, RedirectSrv) {
    var currentUser = null, auth = false, initialState = true;


    var initialState = function () {
        return !angular.isDefined(localStorage.getItem('user')) && initialState;
    };
    var login = function (data) {
        var loginSuccess = function(d){

            if(d[0].status === 'ok'){
                currentUser = {
                    type : d[0].user_type,
                    token : d[0].token
                };
                auth = true;
                localStorage.setItem("user", data.user);
                localStorage.setItem("type", currentUser.type);
                localStorage.setItem("token", currentUser.token);
                initialState = false;
                RedirectSrv.redirect('/');

            }else{
                auth = false;
                $rootScope.loginfail = true;
            }
            return auth;
        };
        var loginFail = function(data){
            console.log(data);
            $rootScope.disconnect = true;
        };
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('login'), data, data).success(loginSuccess).error(loginFail);

    };

    var logout = function () {
        //var logoutSuccess = function(data){
            currentUser = null;
            auth = false;
            initialState = true;
            localStorage.removeItem("user");
            localStorage.removeItem("type");
            localStorage.removeItem("token");
        //};
        //ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('logout'), []).success(logoutSuccess);
    };
    var isLoggedIn = function () {
        return auth;
    };
    var currentUser = function () {
        return currentUser;
    };
    var authorized = function () {
        if(!auth){
            if(angular.isDefined(localStorage.getItem('user')) && localStorage.getItem('user') != null){
                currentUser = {
                    user : localStorage.getItem('user'),
                    type : localStorage.getItem('type'),
                    token : localStorage.getItem('token')
                };
                auth = true;
            }else{
                return false;
            }
        }
        return auth;
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