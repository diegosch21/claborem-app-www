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