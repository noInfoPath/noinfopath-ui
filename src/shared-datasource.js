//shared-datasource.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noSharedDatasource", ['$state', 'noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function($state, noConfig, noManifest, noKendo, noIndexedDB) {
		return {
			restrict: "E",
			link: function(scope, el, attrs) {

				noConfig.whenReady()
					.then(_start)
					.catch(function(err) {
						console.error(err);
					});


				function _start() {
					var area = attrs.noArea,
						tableName = attrs.noDatasource,
						noTable = noManifest.current.indexedDB[tableName],
						config = noConfig.current[area][tableName];

					var ds = noKendo.makeKendoDataSource(tableName, noIndexedDB, {
						serverFiltering: true,
						serverPaging: true,
						serverSorting: true,
						pageSize: config.pageSize || 10,
						batch: false,
						schema: {
							model: config.model
						},
						filter: noKendo.makeKeyPathFiltersFromHashTable($state.params)
					});

					scope.$parent[tableName] = new kendo.data.DataSource(ds);
				}
			}
		};
	}])

	;
})(angular);