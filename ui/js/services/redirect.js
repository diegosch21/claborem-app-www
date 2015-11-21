'use strict';

angular.module('myApp.services').service('RedirectSrv', function ($location){

	var redirectTo = function (hash){
		$location.url(hash);
	};

	return{
		redirect: redirectTo
	};

});