/*
	noinfopath-ui
	@version 0.0.7
*/

//globals.js
(function(angular, undefined){
	angular.module("noinfopath.ui", [
		'ngLodash', 
		'noinfopath.helpers', 
		'noinfopath.kendo'
	]);

	var noInfoPath = {};

	window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);