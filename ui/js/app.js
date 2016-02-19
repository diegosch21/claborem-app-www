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
                RedirectSrv.redirect('/');

            }else{
                auth = false;
                $rootScope.loginfail = true;
            }
            return auth;
        };
        var loginFail = function(data){
            console.log(data);
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

angular.module('myApp.main', []).controller('mainCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {


    $rootScope.plant = {};


    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        $location.path("/login");
    }else{
        RedirectSrv.redirect('/');
    }

    $rootScope.logout = function () {
        AuthSrv.logout();
    }
    $rootScope.changePlant = function(id){
        $rootScope.currentId = id;
        $rootScope.plant = $rootScope.plantas[id];
        RedirectSrv.redirect('/');
    }

    $scope.goToContracts = function(){
        RedirectSrv.redirect('/contracts');
    }

    $scope.goToMaquinarias = function(){
        RedirectSrv.redirect('/maquinarias');
    }


    $scope.goToVehiculos = function(){
        RedirectSrv.redirect('/vehiculos');
    }

    $scope.goToContratistas = function(){
        RedirectSrv.redirect('/contratistas');
    }


    $scope.goToHome = function(){
        RedirectSrv.redirect('/');
    }

    $scope.collapse = function(id){
        $('#' + id).removeClass('in');
        $('#' + id).addClass('collapse');
    }

    $scope.goToWorkForce = function(){
        RedirectSrv.redirect('/workforce');
    }


}]);
'use strict';

angular.module('myApp.contract', []).controller('contractCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'id': $routeParams.id
        };
        var getDataSuccess = function(d){
            $scope.contractData = d;
            console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('contract'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }
    $('#info').tab('show');
    $('#info a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

    $scope.goToWorkerPage = function(id){
        RedirectSrv.redirect('worker/' + $rootScope.plant.id + '/' + id);
    }
    $scope.goToMaquinariaPage = function(id){
        RedirectSrv.redirect('maquinaria/' + $rootScope.plant.id + '/' + id);
    }
    $scope.goToContratistaPage = function(id){
        RedirectSrv.redirect('contratista/' + $rootScope.plant.id + '/' + id);
    }
    $scope.goToVehiculoPage = function(id){
        RedirectSrv.redirect('vehiculo/' + $rootScope.plant.id + '/' + id);
    }

}]);
'use strict';

angular.module('myApp.contracts', []).controller('contractsCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    };
    $scope.sortingOrder = 'Num';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    if($rootScope.plant.id){
        console.log($rootScope.plant);
        var data = {
            token : AuthSrv.currentUser().token,
            idPlanta : $rootScope.plant.id
        }
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('contratos'), data, data)
        .success(function(d){
            console.log(d);
            $scope.items = d;
            $scope.search();
            $scope.loading = false;
        }).error(function(d){
            console.log(d);
            $scope.loading = false;
        });
    }


    // $rootScope.$watch('plant', function () {
    //     if($rootScope.plant.id){
    //         var data = {
    //             token : AuthSrv.currentUser().token,
    //             idPlanta : $rootScope.plant.id
    //         }
    //         ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('contratos'), data, data).success(function(d){
    //             console.log(d);
    //             $scope.items = d;
    //             $scope.search();
    //         })

    //     };
    // }, true);

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        if(haystack){
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }
    };

    $scope.open = function(link){
        $window.open(link, '_blank');
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

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

    // functions have been describe process the data for display
    if($rootScope.plant.data){
        $scope.search();
    }

    $scope.goToContractPage = function(id){
        RedirectSrv.redirect('contract/' + id);
    }

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;


    };

}]);
'use strict';

angular.module('myApp.contratista', []).controller('contratistaCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $routeParams.idP,
            'id': $routeParams.idC
        };
        var getDataSuccess = function(d){
            $scope.contratistaData = d;
            console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('contratista'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }
    $('#info').tab('show');
    $('#info a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

    $scope.goToWorkerPage = function(id){
        RedirectSrv.redirect('worker/' + $rootScope.plant.id + '/' + id);
    }

}]);
'use strict';

angular.module('myApp.contratistas', []).controller('contratistasCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    };
    $scope.sortingOrder = 'Num';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    if($rootScope.plant.id){
        console.log($rootScope.plant);
        var data = {
            token : AuthSrv.currentUser().token,
            idPlanta : $rootScope.plant.id
        }
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('contratistas'), data, data)
        .success(function(d){
            console.log(d);
            $scope.items = d;
            $scope.search();
            $scope.loading = false;
        }).error(function(d){
            console.log(d);
            $scope.loading = false;
        });
    }


    // $rootScope.$watch('plant', function () {
    //     if($rootScope.plant.id){
    //         var data = {
    //             token : AuthSrv.currentUser().token,
    //             idPlanta : $rootScope.plant.id
    //         }
    //         ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('contratistas'), data, data).success(function(d){
    //             console.log(d);
    //             $scope.items = d;
    //             $scope.search();
    //         })

    //     };
    // }, true);

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        if(haystack){
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }
    };

    $scope.open = function(link){
        $window.open(link, '_blank');
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

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

    // functions have been describe process the data for display
    if($rootScope.plant.data){
        $scope.search();
    }

    $scope.goToContratistaPage = function(id){
        RedirectSrv.redirect('contratista/' + $rootScope.plant.id + '/' + id);
    }

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;


    };

}]);
'use strict';

angular.module('myApp.home', []).controller('homeCtrl', ['$scope', '$rootScope', 'ApiHttpSrv', 'ConfigSrv', '$location', 'AuthSrv', 'RedirectSrv',function($scope, $rootScope, ApiHttpSrv, ConfigSrv, $location, AuthSrv, RedirectSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token
        };
        var getDataSuccess = function(data){
            console.log(data[0]);
            $rootScope.data = data[0];
            $rootScope.plantas = $rootScope.data.plantas;

            if(!$rootScope.currentId) { // si ya estaba seteado previamente, agarro esa planta
                $rootScope.currentId = 0
            }

            $rootScope.plant = $rootScope.data.plantas[$rootScope.currentId];
            $scope.loading = false;
        };
        var getDataFail = function(data){
            console.log(data);
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
    else {
        getdata();
    }

    $scope.reintentar = function(){
        getdata()
    }


}]);
'use strict';

angular.module('myApp.login', []).controller('loginCtrl', ['$scope', 'ApiHttpSrv', 'ConfigSrv', '$rootScope', 'AuthSrv', '$location',function($scope, ApiHttpSrv, ConfigSrv, $rootScope, AuthSrv, $location) {

    if (AuthSrv.authorized() && !AuthSrv.initialState()) {
       $location.path("/home");
    }
    $rootScope.loginfail = false;

    $scope.login = function (user) {
        var data = {
            "user": $scope.user.name,
            "pass": $scope.user.password
        };
        AuthSrv.login(data);


    }

}]);
'use strict';

angular.module('myApp.maquinaria', []).controller('maquinariaCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $routeParams.idP,
            'id': $routeParams.idM
        };
        var getDataSuccess = function(d){
            $scope.maquinariaData = d;
            console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('maquinaria'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }
    $('#info').tab('show');
    $('#info a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

    $scope.goToWorkerPage = function(id){
        RedirectSrv.redirect('worker/' + $rootScope.plant.id + '/' + id);
    }

}]);
'use strict';

angular.module('myApp.maquinarias', []).controller('maquinariasCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    };
    $scope.sortingOrder = 'Num';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    if($rootScope.plant.id){
        console.log($rootScope.plant);
        var data = {
            token : AuthSrv.currentUser().token,
            idPlanta : $rootScope.plant.id
        }
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('maquinarias'), data, data)
        .success(function(d){
            console.log(d);
            $scope.items = d;
            $scope.search();
            $scope.loading = false;
        }).error(function(d){
            console.log(d);
            $scope.loading = false;
        });
    }


    // $rootScope.$watch('plant', function () {
    //     if($rootScope.plant.id){
    //         var data = {
    //             token : AuthSrv.currentUser().token,
    //             idPlanta : $rootScope.plant.id
    //         }
    //         ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('maquinarias'), data, data).success(function(d){
    //             console.log(d);
    //             $scope.items = d;
    //             $scope.search();
    //         })

    //     };
    // }, true);

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        if(haystack){
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }
    };

    $scope.open = function(link){
        $window.open(link, '_blank');
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

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

    // functions have been describe process the data for display
    if($rootScope.plant.data){
        $scope.search();
    }

    $scope.goToMaquinariaPage = function(id){
        RedirectSrv.redirect('maquinaria/' + $rootScope.plant.id + '/' + id);
    }

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;


    };

}]);
'use strict';

angular.module('myApp.vehiculo', []).controller('vehiculoCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $routeParams.idP,
            'id': $routeParams.idV
        };
        var getDataSuccess = function(d){
            $scope.vehiculoData = d;
            console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('vehiculo'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }
    $('#info').tab('show');
    $('#info a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

    $scope.goToWorkerPage = function(id){
        RedirectSrv.redirect('worker/' + $rootScope.plant.id + '/' + id);
    }

}]);
'use strict';

angular.module('myApp.vehiculos', []).controller('vehiculosCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    };
    $scope.sortingOrder = 'Num';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    if($rootScope.plant.id){
        console.log($rootScope.plant);
        var data = {
            token : AuthSrv.currentUser().token,
            idPlanta : $rootScope.plant.id
        }
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('vehiculos'), data, data)
        .success(function(d){
            console.log(d);
            $scope.items = d;
            $scope.search();
            $scope.loading = false;
        }).error(function(d){
            console.log(d);
            $scope.loading = false;
        });
    }


    // $rootScope.$watch('plant', function () {
    //     if($rootScope.plant.id){
    //         var data = {
    //             token : AuthSrv.currentUser().token,
    //             idPlanta : $rootScope.plant.id
    //         }
    //         ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('vehiculos'), data, data).success(function(d){
    //             console.log(d);
    //             $scope.items = d;
    //             $scope.search();
    //         })

    //     };
    // }, true);

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        if(haystack){
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }
    };

    $scope.open = function(link){
        $window.open(link, '_blank');
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

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

    // functions have been describe process the data for display
    if($rootScope.plant.data){
        $scope.search();
    }

    $scope.goToVehiculoPage = function(id){
        RedirectSrv.redirect('vehiculo/' + $rootScope.plant.id + '/' + id);
    }

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;


    };

}]);
'use strict';

angular.module('myApp.worker', []).controller('workerCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', '$routeParams', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, $routeParams, ApiHttpSrv, ConfigSrv) {

    var getdata = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $routeParams.idP,
            'id': $routeParams.idE
        };
        var getDataSuccess = function(d){
            $scope.workerData = d;
            console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            console.log(d);
            $scope.loading = false;
        };
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('post', ConfigSrv.getApiUrl('worker'), data, data).success(getDataSuccess).error(getDataFail);
    }

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    }else{
        getdata();
    }
    $('#info').tab('show');
    $('#info a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

}]);
'use strict';

angular.module('myApp.workforce', []).controller('workforceCtrl', ['$scope', '$rootScope','AuthSrv', '$filter', '$window', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',function($scope, $rootScope, AuthSrv, $filter, $window, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    if (AuthSrv.initialState() || !AuthSrv.authorized()) {
        RedirectSrv.redirect('/login');
    };
    $scope.sortingOrder = 'Ape';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    if($rootScope.plant.id){
        console.log($rootScope.plant);
        var data = {
            token : AuthSrv.currentUser().token,
            idPlanta : $rootScope.plant.id
        }
        $scope.loading = true;
        ApiHttpSrv.createApiHttp('get', ConfigSrv.getApiUrl('personal'), data, data)
        .success(function(d){
            console.log(d);
            $scope.items = d;
            $scope.search();
            $scope.loading = false;
        }).error(function(d){
            console.log(d);
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

    $scope.open = function(link){
        $window.open(link, '_blank');
    }

    $scope.goToWorkerPage = function(id){
        RedirectSrv.redirect('worker/' + $rootScope.plant.id + '/' + id);
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

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

    // functions have been describe process the data for display
    if($rootScope.plant.data){
        $scope.search();
    }


    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;


    };

}]);