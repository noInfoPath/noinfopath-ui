/*
	noinfopath-ui
	@version 0.0.19
*/

//globals.js
(function(angular, undefined){
	angular.module("noinfopath.ui", [
		'ngLodash', 
		'noinfopath.helpers', 
		'noinfopath.kendo'
	])

        .run(["$injector", function($injector){
            var noInfoPath = {
                watchFiltersOnScope: function(attrs, dsConfig, ds, scope, $state){
                    function _watch(newval, oldval, scope){
                        console.log("watch", newval, oldval);

                        if(newval && newval !== oldval){
                            var provider = $injector.get(dsConfig.provider),
                                table = provider[dsConfig.tableName],
                                filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
                                options = new window.noInfoPath.noDataReadRequest(table, {
                                    data: {
                                        filter: {
                                            "filters": filters,

                                        },
                                        "sort": ds.sort
                                    }
                                });

                            ds.transport.read(options)
                                .then(function(data){
                                    scope[attrs.noDataSource] = data;
                                })  
                                .catch(function(err){       
                                    console.error(err);
                                });                                   
                        }
                    }

                    if(dsConfig.filter){
                        //watch each dynamic filter's property if it is on the scope
                        angular.forEach(dsConfig.filter, function(fltr){
                            if(angular.isObject(fltr.value) && fltr.value.source === "scope"){
                                scope.$watch(fltr.value.property, _watch);
                            }
                        });

                        //filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
                    }
                }
            };

            window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

        }])
    ;
})(angular);
