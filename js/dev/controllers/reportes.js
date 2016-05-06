'use strict';

angular.module('myApp.reportes', [])
.controller('reportesCtrl',
    ['$scope', '$rootScope', '$window', 'AuthSrv', 'RedirectSrv', 'ApiHttpSrv', 'ConfigSrv',
    function($scope, $rootScope, $window, AuthSrv, RedirectSrv, ApiHttpSrv, ConfigSrv) {

    var url_get = ConfigSrv.getApiUrl('reportes');

    var getData = function () {
        var data = {
            'token': AuthSrv.currentUser().token,
            'idPlanta': $rootScope.plant.id,
        };
        var getDataSuccess = function(d){
            $scope.reportesData = {};
            angular.forEach(d,function(reporte) {
                if (!$scope.reportesData[reporte.Grupo]) {
                    $scope.reportesData[reporte.Grupo] = []
                };
                $scope.reportesData[reporte.Grupo].push({
                    'Nombre' : reporte.Nombre,
                    'Link' : reporte.Link
                });
            });
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

    $scope.openPDF = function(link){
        $window.open(link, '_system');
    }

}]);