//grid.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        //> noGrid currently use Kendo UI Grid. This will be changed in the future
        //> to use an abstraction that will allow other grids to be swapped in.
        .directive("noGrid", ['$state','$q','lodash', 'noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function($state, $q, _, noConfig, noManifest, noKendo, noIndexedDB){
            return {                
                link: function(scope, el, attrs){
                    //Ensure with have a propertly configured application.
                    //In this case a properly configured IndexedDB also.
                    noIndexedDB.whenReady()
                        .then(_start)
                        .catch(function(err){
                            console.error(err);
                        });

                    function _bindGrid(ds, config){
                        if(!config.columns) throw "noGridConfig must have columns defined.";

                        var grid = {
                            groupable: config.groupable || false,
                            pageSize: config.pageSize || 10,
                            sortable: true,                                
                            scrollable: {virtual: true},
                            selectable: "row",
                            dataSource: ds,
                            columns: config.columns ,
                            change: function(){
                                var data = this.dataItem(this.select()),
                                    params = {};

                                params[config.primaryKey] = data[config.primaryKey];

                                if(config.toState){
                                    $state.go($state.current.data.areaName + "." + config.toState, params);
                                }else{
                                    var tableName = this.dataSource.transport.tableName;
                                    scope.$root.$broadcast("noGrid::change+" + tableName, data);
                                }
                            }                              
                        };  

                        if(config.rowTemplate){
                            grid.rowTemplate = kendo.template($(config.rowTemplate).html())
                        }

                        if(config.altRowTemplate){
                            grid.altRowTemplate = kendo.template($(config.altRowTemplate).html())
                        }



                        if(config.toolbar){
                            grid.toolbar = kendo.template($(config.toolbar).html());
                        }

                        el.empty();
                        el.kendoGrid(grid);                   
                    }

                    function _bindDS(tableName, config){
                        if(!config.model) throw tableName + " noGridConfig must have a model defined.";

                        var ds = noKendo.makeKendoDataSource(tableName, noIndexedDB, {
                                serverFiltering: true, 
                                serverPaging: true, 
                                serverSorting: true, 
                                pageSize: config.pageSize || 10 ,
                                batch: false,
                                schema: {
                                    model: config.model
                                },
                                filter: noKendo.makeKeyPathFiltersFromHashTable($state.params)
                            });


                        if(config.sort){
                            ds.sort = config.sort;
                        }

                        _bindGrid(ds, config);
                    }

                    function _resolveLookups(config){
                        var deferred = $q.defer();

                        function _recurse(){
                            var luv = config.values.pop(), tbl, col;

                            if(luv){
                                tbl = noIndexedDB[luv.tableName];

                                tbl.toArray().then(function(resp){
                                    var data = [];
                                    _.each(resp, function(item){
                                        var t = {
                                            text: item[luv.textField],
                                            value: item[luv.valueField]
                                        }
                                        data.push(t);
                                    })

                                    col = _.find(config.columns, {field: luv.columnName});
                                    col.values = data;
                                    _recurse();
                                }); 
                            } else {
                                deferred.resolve();
                            }
                        }

                        _recurse();

                        return deferred.promise;                
                    }

                    function _start(){
                        //wire up watch on scope variable that contains
                        //the IndexedDB table to bind to.
                        if(attrs.noSharedDatasource){
                            scope.$watch(attrs.noSharedDatasource, function(ds){

                                var area = attrs.noGridArea,
                                    tableName = attrs.noSharedDatasource,
                                    noTable = noManifest.current.indexedDB[tableName],
                                    config = noConfig.current.noArea[area][tableName];

                                _bindGrid(ds, config);                                      

                            });
                        }else if($state.current.data && $state.current.data.noGrid){
                            var config = $state.current.data.noGrid;

                            _bindDS(config.tableName, config);
                        }else{
                            var area = attrs.noGridArea,
                                tableName = attrs.noGridDatasource,
                                noTable = noManifest.current.indexedDB[tableName],
                                config = noConfig.current[area][tableName];
                                
                            if(config){
                                if(config.values){
                                    _resolveLookups(config)
                                        .then(_bindDS.bind(this, tableName, config))
                                        .catch(function(err){
                                            console.log(err);
                                        });             
                                }else{
                                    _bindDS(tableName, config);
                                } 
                            }else{
                                throw "noGrid configuration found.";
                            }  
                        }            
                    }
                }
            };
        }])    

    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);