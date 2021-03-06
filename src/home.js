/*
	*	[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
	*
	*	NoInfoPath UI (noinfopath-ui)
	*	=============================================
	*
	*	*@version 2.0.59* [![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)
	*
	*	Copyright (c) 2017 The NoInfoPath Group, LLC.
	*
	*	Licensed under the MIT License. (MIT)
	*	___
*/

//globals.js
(function(angular, undefined) {
	noInfoPath.ui = {};

	angular.module("noinfopath.ui", [
		'ngLodash',
		'noinfopath.helpers',
		'noinfopath.data'
	])

	.run(["$injector", function($injector) {
		var noInfoPath = {
			watchFiltersOnScope: function(attrs, dsConfig, ds, scope, $state, operation) {
				function _watch(newval, oldval, scope) {
					console.log("watch", newval, oldval);

					if (newval && newval !== oldval) {
						var provider = $injector.get(dsConfig.provider),
							table = provider[dsConfig.tableName],
							filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
							options = new window.noInfoPath.noDataReadRequest(table, {
								data: {
									filter: {
										"filters": filters
									},
									"sort": ds.sort
								}
							});

						ds.transport[operation || "read"](options)
							.then(function(data) {
								scope[attrs.noDataSource] = data;
							})
							.catch(function(err) {
								console.error(err);
							});
					}
				}

				if (dsConfig.filter) {
					//watch each dynamic filter's property if it is on the scope
					angular.forEach(dsConfig.filter, function(fltr) {
						if (angular.isObject(fltr.value) && fltr.value.source === "scope") {
							scope.$watch(fltr.value.property, _watch);
						}
					});

					//filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
				}
			}
		};

	}])


	;
})(angular);
