'use strict';

angular.module('myApp.services', [])
    .config(function () {});

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
                $rootScope.updateHome = true; // inicialmente debo obtener data de la home
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
'use strict';

angular.module('myApp.services').service('RedirectSrv', function ($location){

	var redirectTo = function (hash){
		$location.url(hash);
	};



	return{
		redirect: redirectTo
	};

});
'use strict';

/* Filters */

filters.filter('interpolate', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    }
}]);

'use strict';

directives.directive('fadeIn', function () {
    return {
        compile:function (elm) {
            $(elm).css('opacity', 0.0);
            return function (scope, elm, attrs) {
                $(elm).animate({ opacity:1.0 }, 1000);
            };
        }
    };
});
'use strict';

// this is the angular way to stop even propagation
directives.directive('stopEvent', function () {
    return {
        restrict:'A',
        link:function (scope, element, attr) {
            element.bind(attr.stopEvent, function (e) {
                e.stopPropagation();
            });
        }
    }
});
'use strict';

angular.module('myApp.main', [])
    .controller('mainCtrl',
        ['$scope', '$rootScope', '$window', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',
        function($scope, $rootScope, $window, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


    $rootScope.plant = {};


    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path("/login");
    }else{
        $rootScope.updateHome = true; // inicialmente debo actualizar la home
        RedirectSrv.redirect('/');
    }

    $rootScope.logout = function () {
        AuthSrv.logout();
        $rootScope.data = null;
        $rootScope.plantas = null;
        $rootScope.currentId = null;
        $rootScope.plant = null;
        $rootScope.collections = {};
    }
    $rootScope.changePlant = function(id){
        $rootScope.currentId = id;
        $rootScope.plant = $rootScope.plantas[id];
        $rootScope.collections = {}; // destruyo las colecciones (para prevenir errores con back button)
        RedirectSrv.redirect('/');
    }

    $scope.goToContratos = function(){
        RedirectSrv.redirect('/contratos');
    }

    $scope.goToContratoPage = function(id){
        RedirectSrv.redirect('/contrato/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToContratistas = function(){
        RedirectSrv.redirect('/contratistas');
    }

    $scope.goToContratistaPage = function(id){
        RedirectSrv.redirect('/contratista/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToPersonal = function(){
        RedirectSrv.redirect('/personal');
    }

    $scope.goToEmpleadoPage = function(id){
        RedirectSrv.redirect('/empleado/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToMaquinarias = function(){
        RedirectSrv.redirect('/maquinarias');
    }

    $scope.goToMaquinariaPage = function(id){
        RedirectSrv.redirect('/maquinaria/' + $rootScope.plant.id + '/' + id);
    }

    $scope.goToVehiculos = function(){
        RedirectSrv.redirect('/vehiculos');
    }

    $scope.goToVehiculoPage = function(id){
        RedirectSrv.redirect('/vehiculo/' + $rootScope.plant.id + '/' + id);
    }


    $rootScope.goBack = function(){
        $window.history.back();
    }

    $rootScope.goToHome = function(){
        // $rootScope.updateHome = true;  // si aprieto inicio actualiza la home
        RedirectSrv.redirect('/');
    }

    $scope.collapse = function(id){
        $('#' + id).removeClass('in');
        $('#' + id).addClass('collapse');
    }

}]);
/**
 * Controller para listados: contratos, contratistas, personal, vehículos, maquinarias
 */
'use strict';

angular.module('myApp.collections', [])
    .controller('collectionsCtrl',
        ['$scope', '$rootScope','context', '$window', '$filter', 'AuthSrv', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',
        function($scope, $rootScope, context, $window, $filter, AuthSrv,  RedirectSrv, ApiHttpSrv, ConfigSrv) {

        if (AuthSrv.initialState() || !AuthSrv.authorized()) {
            RedirectSrv.redirect('/login');
        };
        if(!$rootScope.plant) {
            $rootScope.goToHome();
        }

        // los items son guardados en $rootScope.collections.<type> cuando se obtiene la data
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        var itemsPerPage = 10;
        var filteredItems = [];
        var sortingOrder = context.sortingOrder;
        var reverse = false;

        var url_get = ConfigSrv.getApiUrl(context.type); // en context.type se setea el tipo de coleccion (contratos, vehiculos, etc)

        var getData = function() {
            var data = {
                token : AuthSrv.currentUser().token,
                idPlanta : $rootScope.plant.id
            }
            $scope.loading = true;
            ApiHttpSrv.createApiHttp('get', url_get, data, data)
            .success(function(d){
                // console.log(d);
                $rootScope.collections[context.type] = d;
                groupToPages();
                // $scope.search();
                $scope.loading = false;
                $rootScope.updateCollection = false; // flag de actualizar en false: no se volverá a pedir la data hasta no setearlo en true
                $scope.currentPlantId = $rootScope.plant.id
            }).error(function(d){
                // console.log(d);
                $scope.loading = false;
            });
        }

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            if(haystack){
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
            }
        };

        // calculate page in place
        var groupToPages = function (filtered) {
            $scope.pagedItems = [];

            var items = $rootScope.collections[context.type];
            if (filtered) {
                items = $scope.filteredItems;
            }

            for (var i = 0; i < items.length; i++) {
                if (i % itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / itemsPerPage)] = [ items[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / itemsPerPage)].push(items[i]);
                }
            }
        };

        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($rootScope.collections[context.type], function (item) {
                for(var attr in item) {
                    if (searchMatch(item[attr], $scope.query))  // si no hay query retorna true
                        return true;
                }
                return false;
            });
            // take care of the sorting order
            if (sortingOrder && sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, sortingOrder, $scope.reverse);
            }
            $scope.currentPage = 0;
            // now group by pages
            groupToPages(true);
        };

        // Cargo y muestro data:
        if (!$rootScope.collections[context.type]) {
            // si no hay items, obtengo la data
            getData();
        }
        else {
            groupToPages();
        }

        $scope.open = function(link){
            $window.open(link, '_blank');
        }

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        // change sorting order
        $scope.sort_by = function(newSortingOrder) {
            if (sortingOrder == newSortingOrder)
                reverse = !reverse;

            sortingOrder = newSortingOrder;
        };

}]);
/**
 * Controller para mostrar la data de una entidad: contrato, contratista, empleado, vehículo, maquinaria
 */
'use strict';

angular.module('myApp.entity', [])
.controller('entityCtrl',
    ['$scope', '$rootScope','$routeParams', 'context', '$window', '$filter', 'AuthSrv', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',
    function($scope, $rootScope, $routeParams, context, $window, $filter, AuthSrv, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    var url_get = ConfigSrv.getApiUrl(context.type); // en context.type se setea el tipo de entidad (contratos, vehiculos, etc)

    var getData = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $routeParams.idP,
            'id': $routeParams.id
        };
        var getDataSuccess = function(d){
            $scope.entityData = d[0];
            // console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            // console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', url_get, data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getData();
    }

}]);
'use strict';

angular.module('myApp.home', [])
.controller('homeCtrl',
    ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',
    function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {

        var getdata = function () {
            var data = {
                'token': AuthSrv.currentUser().token
            };
            var getDataSuccess = function(data){
                // console.log(data[0]);
                $rootScope.data = data[0];
                $rootScope.plantas = $rootScope.data.plantas;

                if(!$rootScope.currentId) { // si ya estaba seteado previamente, agarro esa planta
                    $rootScope.currentId = 0
                }
                $rootScope.plant = $rootScope.data.plantas[$rootScope.currentId];
                $rootScope.collections = {};

                $scope.loading = false;
                $rootScope.updateHome = false; // flag de actualizar en false: no se volverá a pedir la data hasta no setearlo en true
            };
            var getDataFail = function(data){
                // console.log(data);
                $scope.loading = false;
                $scope.disconnect = true;
            };
            $scope.loading = true;
            $scope.disconnect = false;
            ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('home'), data, data).success(getDataSuccess).error(getDataFail);
        }
        if (AuthSrv.initialState() || !AuthSrv.authorized()) {
            $location.path('/login');
        }

        // si ya estaba seteada la planta no la actualizo (salvo que esté seteado el flag de actualizar)
        if (!$rootScope.plant || $rootScope.updateHome) {
            getdata();
        }

        $scope.update = function(){
            getdata();
        }

}]);
'use strict';

angular.module('myApp.login', []).controller('loginCtrl', ['$scope', 'ApiHttpSrv', 'ConfigSrv', '$rootScope', 'AuthSrv', '$location',function($scope, ApiHttpSrv, ConfigSrv, $rootScope, AuthSrv, $location) {

    if (AuthSrv.authorized() && !AuthSrv.initialState()) {
       $location.path("/home");
    }
    $rootScope.loginfail = false;
    $rootScope.disconnect = false;

    $scope.login = function (user) {
        var data = {
            "user": $scope.user.name,
            "pass": $scope.user.password
        };
        AuthSrv.login(data);

    }

}]);