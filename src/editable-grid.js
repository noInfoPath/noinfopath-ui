//editable-grid.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noEditableGrid", ['$q','lodash', 'noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function($q, _, noConfig, noManifest, noKendo, noIndexedDB){
            return {                
                link: function(scope, el, attrs){
                    //Ensure with have a propertly configured application.
                    //In this case a properly configured IndexedDB also.
                    noConfig.whenReady()
                        .then(_start)
                        .catch(function(err){
                            console.error(err);
                        });

                    function _bindGrid(tableName, config){
                        var ds =  noKendo.makeKendoDataSource(tableName, noIndexedDB, {
                            serverFiltering: true, 
                            serverPaging: true, 
                            serverSorting: true, 
                            pageSize: config.pageSize || 10,
                            batch: false,
                            schema: {
                                model: config.model
                            }
                        }),
                        grid = {
                            sortable: true,
                            scrollable: {virtual: true},
                            selectable: "row",
                            dataSource: ds,
                            pageSize: config.pageSize || 10,
                            columns: config.columns,
                            editable: "inline",
                            toolbar: ["create"]
                        };   
                        el.empty();
                        el.kendoGrid(grid);                   
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

                        console.warn("TODO: abstract to use the CRUD pattern found in noinfopath-storage.")

                        scope.$watch(attrs.noEditableGrid, function(newval){
                            if(newval){
                                var tableName = scope[attrs.noEditableGrid],
                                    noTable = noManifest.current.indexedDB[tableName],
                                    config = noConfig.current.lookups[tableName],
                                    fullCRUD = true;

                                if(config.values){
                                    _resolveLookups(config)
                                        .then(_bindGrid.bind(this, tableName, config))
                                        .catch(function(err){
                                            console.log(err);
                                        });             
                                }else{
                                    _bindGrid(tableName, config);
                                }                                      
                            }
                        });
                    }
                }
            };
        }])
    ;

    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);
})(angular);


