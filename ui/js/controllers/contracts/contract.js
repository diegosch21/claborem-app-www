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
        };
        var getDataFail = function(d){
            console.log(d);
        };
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