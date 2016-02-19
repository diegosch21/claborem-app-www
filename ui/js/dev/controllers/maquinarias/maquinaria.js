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
        };
        var getDataFail = function(d){
            console.log(d);
        };
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