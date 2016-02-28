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
            // console.log(d);
            $scope.loading = false;
        };
        var getDataFail = function(d){
            // console.log(d);
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