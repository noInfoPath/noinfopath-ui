//breadcrumb.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noAutoComplete", ['noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function(noConfig, noManifest, noKendo, noIndexedDB){
            return {
                restrict: "A",
                link: function(scope, el, attrs){
                    noConfig.whenReady()
                        .then(_start)
                        .catch(function(err){
                            console.error(err);
                        });

                    function _bindCtrl(ds, config){
                        var autoComplete = {
                            open: function(e){
                                e.preventDefault();
                            },
                            filter: "js",
                            //dataTextField: "FieldPlotCode,SelectionCode,TrialName",
                            dataSource: ds                             
                        };
                      
                        el.kendoAutoComplete(autoComplete); 
                    }

                    function _bindDS(tableName, config){
                        var ds = noKendo.makeKendoDataSource(tableName, noIndexedDB, {
                                    serverFiltering: true
                                });
                               
                        _bindCtrl(ds);   
                    }

                    function _start(){
                        if(attrs.noSharedDatasource){
                            scope.$watch(attrs.noSharedDatasource, function(ds){
                                _bindCtrl(ds, config);
                            });
                        }else{
                            var area = attrs.noArea,
                                tableName = attrs.noDatasource,
                                noTable = noManifest.current.indexedDB[tableName],
                                config = noConfig.current[area][tableName];

                            _bindDS(tableName, config);                                
                        }
                    }
                }
            }
        }])
    ;

    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);


