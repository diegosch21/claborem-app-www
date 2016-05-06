'use strict';

angular.module('myApp.services').service('ConfigSrv', function (config) {
    //assert helper for config service
    var _assert = function(expression, msg){
        if(!expression) {
            throw 'ConfigSrv ERROR: ' + msg;
        }
    };

    //get config by json path, for example getConfig('x.y.z')
    var getConfig = function(path){
        return _keypath(config,path);
    };

    // get api url by method name
    var getApiUrl = function(method_name) {
        //get Method Config
        var methodConf = getConfig('api.methods.'+method_name);
        _assert(methodConf, 'api method '+method_name+' is not defined in api.methods');

        return methodConf;
    };

    // get a list of routes configurations, outside function for performance
    var routeConfig = getConfig('routes');

    // returns the config route
    var getRouteConfig = function getRouteConfig(urlpath) {
        var result =  _.find(routeConfig, function(conf){
            var re = new RegExp('^'+conf.path+'$');
            var matches = re.test(urlpath);
            return matches;
        });
        return result;
    };

    //return service
    return {
        getConfig: getConfig,
        getApiUrl: getApiUrl,
        getRouteConfig: getRouteConfig
    };
});

//TODO move
window._keypath = function(content, key){
    var originalKeyString, keys, partialContent;

    if( !_.isString(key) || _.isEmpty(content)){
        return;
    }

    if( key.indexOf('.') === -1 ){
        return content[key] || undefined;
    }else{
        partialContent = content;
        originalKeyString = key;
        keys = key.split('.');

        keys.forEach(function(key){
            if( !partialContent ){
                return;
            }

            partialContent = partialContent[key] || undefined;
        });

        return partialContent;
    }
};