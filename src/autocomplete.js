//autocomplete.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noAutoComplete", ['$parse', '$state', 'noAppStatus', 'noKendo', 'noIndexedDB', function($parse, $state, noAppStatus, noKendo, noIndexedDB){
            return {
                restrict: "A",
                compile: function(el, attrs){

                    
                    var _ngModel = el.attr("no-ng-model"), 
                        _noNgModel = _ngModel + "_display";

                    if(!_ngModel) throw "noAutoComplete requires attribite ng-model.";

                    attrs.ngModel = _noNgModel;
                    attrs.noNgModel = _ngModel;

                    el.attr("ng-model", _noNgModel);
                    el.attr("no-ng-model", _ngModel);

                    return function (scope, el, attrs){
                        //if(!attrs.ngModel) throw "ngModel is a required attribute for noAutoComplete";

                        noAppStatus.whenReady()
                            .then(_start)
                            .catch(function(err){
                                console.error(err);
                            });

                        function _bindCtrl(ds, config){
                            var autoComplete = {
                                valuePrimitive: true, 
                                dataTextField: config.textField,
                                dataSource: ds,
                                select: function(e){
                                    var getter = $parse(attrs.noNgModel),
                                        setter = getter.assign,
                                        item = this.dataItem(e.item), 
                                        val = item ? item[attrs.noValueField] : undefined,
                                        txt = item ? item[attrs.noTextField]: "";


                                    scope.$apply(function(){
                                        window.noInfoPath.setItem(scope, attrs.noNgModel, val);
                                        window.noInfoPath.setItem(scope, attrs.ngModel, txt);
                                    });

                                   // scope[attrs.noNgModel] = 
                                },
                                change: function(e){
                                    //scope.coolertrial.SelectionID = scope.coolertrial.SelectionID_.SelectionID;
                                    if(el.val() != window.noInfoPath.getItem(scope, attrs.ngModel)){
                                        window.noInfoPath.setItem(scope, attrs.noNgModel, undefined);
                                        window.noInfoPath.setItem(scope, attrs.ngModel, "");                                       
                                    }
                                }                     
                            };
                          
                            el.empty();
                            el.kendoAutoComplete(autoComplete); 
                        }

                        function _bindDS(tableName, config){
                            var ds = noKendo.makeKendoDataSource(tableName, noIndexedDB, {
                                        serverFiltering: true,
                                        schema: {
                                            model: config.model
                                        }
                                    });
                            if(config.sort){
                                ds.sort = config.sort;
                            }       
                            _bindCtrl(ds, config);   
                        }

                        function _start(){
                            if(attrs.noSharedDatasource){
                                scope.$watch(attrs.noSharedDatasource, function(ds){
                                    _bindCtrl(ds, config);
                                });
                            }else if(attrs.noArea){
                                var area = attrs.noArea,
                                    tableName = attrs.noDatasource,
                                    noTable = noManifest.current.indexedDB[tableName],
                                    config = noConfig.current[area][tableName];

                                _bindDS(tableName, config);                                
                            }else{
                                //Use $state.current.data
                                var cfg = $state.current.data[attrs.noAutoComplete];
                                _bindDS(cfg.tableName, cfg);
                            }
                        }
                    };

                    
                }

            }
        }])
    ;

    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);
})(angular);
