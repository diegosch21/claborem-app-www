'use strict';

angular.module('myApp.services').service('AuthSrv', function ($http, ConfigSrv, ApiHttpSrv, RedirectSrv) {
    var currentUser = null, auth = false, initialState = true;


    var initialState = function () {
        return !angular.isDefined(localStorage.getItem('user')) && initialState;
    };
    var login = function (data) {
        /*var loginSuccess = function(data){
            if(data[0].Estado === 'ok'){
                currentUser = {
                    type : data[0].tipo,
                    token : data[0].token
                };
                auth = true;
                initialState = false;
            }
        };
        var loginFail = function(data){
            console.log(data);
        };
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('login'), data).success(loginSuccess).error(loginFail);
        */

        //mock login API
        if(data.User == 'contratista_demo' && data.Password == '123'){
            currentUser = {
                    user : data.User,
                    type : 'contratista',
                    token : 'th77gh053bh34ibn'
                };
            auth = true;
            localStorage.setItem("user", data.User);
            localStorage.setItem("type", "contratista");
            localStorage.setItem("token", "th77gh053bh34ibn");
            initialState = false;
            RedirectSrv.redirect('/');
        }else if(data.User == 'planta_demo' && data.Password == '123'){
            currentUser = {
                    user : data.User,
                    type : 'planta',
                    token : 'ghmyj8i5b3b35rd'
                };
            auth = true;
            localStorage.setItem("user", data.User);
            localStorage.setItem("type", "planta");
            localStorage.setItem("token", "th77gh053bh34ibn");
            initialState = false;
            RedirectSrv.redirect('/');
        }else{
            auth = false;
        }
        return auth;
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