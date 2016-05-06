'use strict';

angular.module('myApp.services').service('ApiHttpSrv', function ($http) {

    // returns a timestamp for the requests
    var getTimestamp = function(){
        return new Date().getTime();
    };



    //creates an http object with required headers
    var createHttp = function(type, url, data, headers){
        var config = {
            method: type,
            url: url,
            data: data ? data : '',
            cache: false,
            headers: (headers) ? headers : []
        };
        // create http
        return $http(config);
    };

    //creates an http resource, from an api endpoint baseurl
    //Use name and map it with configSrv
    var createApiHttp = function(type, baseurl, data, params, headers){
        // convert params object into a string of params, if not string
        if(params) {
            params = angular.isString(params) ? params : $.param(params);
        }
        // create url
        var url = baseurl + (params ? '?'+params : '');
        // create http
        return createHttp(type, url, data, headers);
    };

    //Response status form 200 to 299 are considered successful responses
    var isSuccessResponse = function(response) {
        return (response.status && response.status >= 200 && response.status <= 299);
    };

    //return service
    return {
        createHttp: createHttp,
        createApiHttp: createApiHttp,
        getTimestamp: getTimestamp,
        isSuccessResponse: isSuccessResponse
    };
});

