/*
	noinfopath-ui@0.0.3
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
//progressbar.js
(function(angular, undefined){
	angular.module("noinfopath.ui")
        .directive("noProgressbar", ['$timeout', 'lodash', function($timeout, _) {

                function progressTracker() {
                    this.message = "Loading";
                    this.current = 0;
                    this.percent = 0;
                    this.max = 0;
                    this.showProgress = true;
                    this.css = "";
                }

                progressTracker.prototype.start = function(options){
                    var def = _.extend({min: 0, max: 0, showProgress: true, css: ""}, options || {} );

                    this.current = def.min;                
                    this.max = def.max;
                    this.showProgress = def.showProgress;   
                    this.css = def.css;
                    this.update(); 
                }

                progressTracker.prototype.update = function(msg) {
                    //console.log(angular.toJson(this));
                    if(this.max > 0){
                        this.percent = this.max == 0 ? 0 : Math.ceil((this.current / this.max) * 100);
                        this.changeMessage(msg || "", this.showProgress);
                        //console.info(this.message, this.current, this.max, this.percent)
                        this.current++;
                    }else{
                        this.percent = 0;
                        this.message = "";
                    }
                }

                progressTracker.prototype.changeMessage = function(msg, showProgress){
                    this.message = msg + (showProgress  ?  " (" + this.percent + "%)" : "");
                }

                progressTracker.prototype.changeCss = function(css){
                    this.css = css;
                }

                var link = function(scope, el, attr, ctrl) {

                    function update() {
                        var p = angular.element(el.children()[0]),
                            m = angular.element(el.children()[1]);

                        p.removeAttr("class");
                        p.addClass("progress-bar " + this.css );
                        p.css("width", this.percent + "%");
                        p.attr("aria-valuenow", this.percent);
                        m.text(this.message);
                    }


                    el.addClass("progress");
                    el.append('<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/><div class="no-progress-message"></div>');

                    scope.$watch(attr.noProgressbar + ".percent", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                                var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));

                    scope.$watch(attr.noProgressbar + ".message", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                               var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));

                    scope.$watch(attr.noProgressbar + ".css", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                                var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));                
                },
                controller = ['$scope','$element', function($scope, $element) {
                        var noProgressbar = $element.attr("no-progressbar")

                        $scope[noProgressbar] = new progressTracker();
                }],
                directive = {
                    restrict: "A",
                    controller: controller,
                    link: link
                };

                return directive;
        }])
	;

	
	var noInfoPath = {};

	window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);
//autocomplete.js
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



//breadcrumb.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBreadcrumb", ['$q', '$state', 'noConfig', 'noIndexedDB', function($q, $state, noConfig, _noIndexedDB_){
            function noBreadcrumb($state, config){

                var state = $state, _states = {},
                _index = [],
                _visible = [];

                //Update the current `this.current` list of breadcums to stop at
                //supplied `stateName`.
                this.update = function (toState){
                    var state = toState;
                   _visible = [];
                   for(var i in _index){
                        var item = _index[i];
                        _visible.push(item);
                        if(item === state.name){
                            break;
                        }
                   }
                };

                //Loads state configuration from a hash table supplied `states`
                this.load = function (states){
                 
                    angular.extend(_states, states);
                    _index = [];
                    angular.forEach(_states, function(item, key){
                        _index.push(key)
                        item.state = state.get(key);
                    });
                };

                //Reset both the list `_states` and `_visible` states
                this.reset = function (){
                    _states = {};
                    _visible = {};
                }

                if(config){
                    this.load(config);
                }

                Object.defineProperties(this, {
                    "current": {
                        "get": function(){
                            return _visible;
                        }
                    },
                    "states": {
                        "get": function(){
                            return _states;
                        }
                    }
                })
            }

            var directive = {
                template: "<ol class=\"breadcrumb\"></ol>",
                link: function(scope, el, attrs){
                    var state = $state,
                        q = $q,
                        noIndexedDB = _noIndexedDB_,
                        scopeKey;

                    function _start(){

                        //scope is defaults to noBreadcrumb, however if the 
                        //directive's primary attribute has a value, that will be
                        //used instead.
                        scopeKey = attrs.noBreadcrumb || "noBreadcrumb";  

                        //`noConfig.current.settings` should have a property with a name
                        //that matches `scopeKey`. 
                        config = noConfig.current.settings[scopeKey]; 
                        scope.noBreadcrumb = new noBreadcrumb($state, config);                         

                        //whenever ui-router broadcasts the $stateChangeSuccess event
                        //noBreadcrumb will refresh itself based on the current state's 
                        //properties.
                        scope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams){
                            console.log(toState, toParams, fromState, fromParams);

                            var c = config[toState.name];
                            if(!c) throw toState.name + " noBreadcrumb comfig was not found in config.json file.";
                            if(!c.title) throw "noBreadcrumb.title is a required property in config.json";

                            //Is c.title and object or a string?
                            if(angular.isObject(c.title)){                                
                                if(!c.title.dataSource) throw "noBreadcrumb.title.dataSource is a required property in config.json";
                                if(!c.title.textField) throw "noBreadcrumb.title.textField is a required property in config.json";
                                if(!c.title.valueField) throw "noBreadcrumb.title.valueField is a required property in config.json";

                                //When c.title is an object the breadcrumb title
                                //is derrived from a database record.  Resolve the
                                //record before updating the scope.noBreadcrumb 
                                //object.
                                var _table = noIndexedDB[c.title.dataSource],
                                    _field = c.title.valueField,
                                    _value = toParams[c.title.valueField],
                                    req = new noInfoPath.noDataReadRequest(q, _table);

                                //Assume that all strings that can be converted to a number
                                //should be converted to a number.
                                var num = Number(_value);
                                if(angular.isNumber(num)){
                                    _value = Number(num);
                                }      

                                //Configure and execute a noDataReadRequest object
                                //against noIndexedDB::table.noCRUD::one extention method.
                                req.addFilter(_field, "eq", _value);                                    
                                _table.noCRUD.one(req)
                                    .then(function(data){
                                        //When the title data is resolved save the data on the
                                        //toState's data property, then update the appropriate 
                                        //scope item using the current toState.
                                        toState.data = data;
                                        scope[scopeKey].update(toState);
                                        _refresh();
                                    })
                                    .catch(function(err){
                                        console.error(err);
                                    });   
                            }else{
                                //If the title is not an object, assume it is a string and
                                //just update the appropriate scope item using the current toState.
                                scope[scopeKey].update(toState);
                                _refresh();
                            }
                        })  
                    } 
            
                    function _refresh(){
                        var ol = el.find("ol");
                        ol.empty();
                        angular.forEach(scope.noBreadcrumb.current, function(item, i){
                            var state = this.states[item],
                                title, 
                                url = state.urlTemplate, urlParam;

                            //if data and ":" + valueField in url then replace ":" + valueField with data[valueField]
                            // if(state.state.data && state.valueField && state.state.url.indexOf(":" + state.valueField) > -1){
                            //     url = "#" + state.urlTemplate.replace(":" + state.valueField, state.state.data[state.valueField]);
                            // }

                            if(angular.isObject(state.title)){
                                url = url.replace(":" + state.title.valueField, state.state.data[state.title.valueField]);

                                if(state.state.data){
                                    title = state.state.data[state.title.textField];
                                }else{
                                    title = state.state.name;
                                }
                                
                            }else{
                                title = state.title || state.state.name;
                            }


                            if(i === this.current.length - 1){
                                 ol.append("<li>" + title + "</li>")
                            }else{
                                if(url){
                                    ol.append("<li><a href=\"" + url + "\">" + title + "</a></li>");   
                                }else{
                                    ol.append("<li>" + title + "</li>")
                                }
                            }

                        },scope.noBreadcrumb);
                    }

                    noIndexedDB.whenReady()
                        .then(_start)
                        .catch(function(err){
                            console.error(err);
                        });                        
                }
            }

            return directive;
        }])

    
    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);



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
//resize.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noResize", [function(){
            var link = function(scope, el, attr){
                    el.css("height", (window.innerHeight - Number(attr.noResize ? attr.noResize : 90)) + "px");
                    //console.log("height: ", el.height());
                    
                    scope.onResizeFunction = function() {
                        scope.windowHeight = window.innerHeight;
                        scope.windowWidth = window.innerWidth;

                        //console.log(scope.windowHeight+"-"+scope.windowWidth)
                    };

                    // Call to the function when the page is first loaded
                    scope.onResizeFunction();

                    angular.element(window).bind('resize', function() {
                        scope.onResizeFunction();
                        scope.$apply();
                    });             
                },
                dir = {
                    restrict: "A",
                    link: link
                };

            return dir;
        }])
    
    ;
    
    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);



//shared-datasource.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noSharedDatasource", ['$state','noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function($state, noConfig, noManifest, noKendo, noIndexedDB){
            return {
                restrict: "E",
                link: function(scope, el, attrs){

                    noConfig.whenReady()
                        .then(_start)
                        .catch(function(err){
                            console.error(err);
                        });


                    function _start(){
                        var area = attrs.noArea,
                            tableName = attrs.noDatasource,
                            noTable = noManifest.current.indexedDB[tableName],
                            config = noConfig.current[area][tableName];

                         var ds =  noKendo.makeKendoDataSource(tableName, noIndexedDB, {
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

                        scope.$parent[tableName] = new kendo.data.DataSource(ds);                   
                    }
                }
            }
        }])

    ;
    var noInfoPath = {};

    window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);

})(angular);


