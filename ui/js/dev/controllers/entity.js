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