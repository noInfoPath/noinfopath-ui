/*
 *  # noinfopath.ui
 *
 *  > @version 0.0.35
*/

//globals.js
(function(angular, undefined){
    noInfoPath.ui = {};

    angular.module("noinfopath.ui", [
        'ngLodash',
        'noinfopath.helpers',
        'noinfopath.data'
    ])

        .run(["$injector", function($injector){
            var noInfoPath = {
                watchFiltersOnScope: function(attrs, dsConfig, ds, scope, $state, operation){
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

                            ds.transport[operation || "read"](options)
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

        }])


    ;
})(angular);

//progressbar.js
(function(angular, undefined){
	angular.module("noinfopath.ui")
        .directive("noProgressbar", ['$timeout', 'lodash', function($timeout, _) {

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

				//Watching for changes to this progress bar instance.
				scope.$watchCollection(attr.noProgressbar, function(newData, oldData, scope) {
					if (newData) {
						$timeout(function() {
							var r = scope.$root || scope;
							r.$apply(update.bind(this));
						}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
					}
				}.bind(attr));

				//TODO: Remove this code after E2E testing.
				// scope.$watch(attr.noProgressbar + ".message", function(newData, oldData, scope) {
				// 	if (newData) {
				// 		$timeout(function() {
				// 		   var r = scope.$root || scope;
				// 			r.$apply(update.bind(this));
				// 		}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
				// 	}
				// }.bind(attr));
				//
				// scope.$watch(attr.noProgressbar + ".css", function(newData, oldData, scope) {
				// 	if (newData) {
				// 		$timeout(function() {
				// 			var r = scope.$root || scope;
				// 			r.$apply(update.bind(this));
				// 		}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
				// 	}
				// }.bind(attr));
			},
			controller = ['$scope','$element', function($scope, $element) {
					// var noProgressbar = $element.attr("no-progressbar")
					//
					// $scope[noProgressbar] = new progressTracker();
			}],
            directive = {
                restrict: "A",
                controller: controller,
                link: link
            };

            return directive;
        }])
	;
})(angular);

//breadcrumb.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBreadcrumb", ['$q', '$state', 'noConfig', '$injector', function($q, $state, noConfig, $injector){
            function NoBreadcrumb($state, config){

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
                        _index.push(key);
                        item.state = state.get(key);
                    });
                };

                //Reset both the list `_states` and `_visible` states
                this.reset = function (){
                    _states = {};
                    _visible = {};
                };

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
                });
            }

            var directive = {
                template: "<ol class=\"breadcrumb\"></ol>",
                link: function(scope, el, attrs){
                    var state = $state,
                        q = $q,
                        db = $injector.get(attrs.noProvider),
                        scopeKey;

                    function _start(){

                        //scope is defaults to noBreadcrumb, however if the
                        //directive's primary attribute has a value, that will be
                        //used instead.
                        scopeKey = attrs.noBreadcrumb || "noBreadcrumb";

                        //`noConfig.current.settings` should have a property with a name
                        //that matches `scopeKey`.
                        config = noConfig.current.settings[scopeKey];
                        scope.noBreadcrumb = new NoBreadcrumb($state, config);

                        //whenever ui-router broadcasts the $stateChangeSuccess event
                        //noBreadcrumb will refresh itself based on the current state's
                        //properties.
                        scope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams){
                            //console.log(toState, toParams, fromState, fromParams);
                            return;

                            // var c = config[toState.name];
                            // if(!c) throw toState.name + " noBreadcrumb comfig was not found in config.json file.";
                            // if(!c.title) throw "noBreadcrumb.title is a required property in config.json";
                            //
                            // //Is c.title and object or a string?
                            // if(angular.isObject(c.title)){
                            //     if(!c.title.dataSource) throw "noBreadcrumb.title.dataSource is a required property in config.json";
                            //     if(!c.title.textField) throw "noBreadcrumb.title.textField is a required property in config.json";
                            //     if(!c.title.valueField) throw "noBreadcrumb.title.valueField is a required property in config.json";
                            //
                            //     //When c.title is an object the breadcrumb title
                            //     //is derrived from a database record.  Resolve the
                            //     //record before updating the scope.noBreadcrumb
                            //     //object.
                            //     var _table = db[c.title.dataSource],
                            //         _field = c.title.valueField,
                            //         _value = toParams[c.title.valueField],
                            //         req = new noInfoPath.noDataReadRequest(q, _table);
                            //
                            //     //Assume that all strings that can be converted to a number
                            //     //should be converted to a number.
                            //     var num = Number(_value);
                            //     if(angular.isNumber(num)){
                            //         _value = Number(num);
                            //     }
                            //
                            //     //Configure and execute a noDataReadRequest object
                            //     //against noIndexedDB::table.noCRUD::one extention method.
                            //     req.addFilter(_field, "eq", _value);
                            //     _table.noCRUD.one(req)
                            //         .then(function(data){
                            //             //When the title data is resolved save the data on the
                            //             //toState's data property, then update the appropriate
                            //             //scope item using the current toState.
                            //             toState.data = data;
                            //             scope[scopeKey].update(toState);
                            //             _refresh();
                            //         })
                            //         .catch(function(err){
                            //             console.error(err);
                            //         });
                            // }else{
                            //     //If the title is not an object, assume it is a string and
                            //     //just update the appropriate scope item using the current toState.
                            //     scope[scopeKey].update(toState);
                            //     _refresh();
                            // }
                        });
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
                                 ol.append("<li>" + title + "</li>");
                            }else{
                                if(url){
                                    ol.append("<li><a href=\"" + url + "\">" + title + "</a></li>");
                                }else{
                                    ol.append("<li>" + title + "</li>");
                                }
                            }

                        },scope.noBreadcrumb);
                    }

                    // db.whenReady()
                    //     .then(_start)
                    //     .catch(function(err){
                    //         console.error(err);
                    //     });
                }
            };

            return directive;
        }]);


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
})(angular);

//menu.js
(function(angular, undefined){
    function MenuItem(){
        if(arguments.length == 1 && angular.isObject(arguments[0])){
            this.title = arguments[0].title;
            this.state = arguments[0].state;
            this.glyph = arguments[0].glyph;
            this.children = [];
        }else if(arguments.length > 1){
            this.title = arguments[0];
            this.state = arguments[1];
            this.children = arguments.length == 3 ? arguments[2] : [];
        }else{
            this.title = "";
            this.state = "";
            this.children = [];
        }
    }
    noInfoPath.ui.MenuItem = MenuItem;

    function _buildMenuItem(menuItem, el){
        if(menuItem.title){
            var li = angular.element("<li></li>"),
                a = angular.element("<a></a>");

            a.text(menuItem.title);
            li.append(a);
            el.append(li);

            if(menuItem.glyph){
                a.append(menuItem.glyph);
            }

            if(menuItem.state){
                a.attr("ui-sref", menuItem.state);

            }else{
                li.attr("dropdown","");
                li.addClass("dropdown");
                a.attr("href", "#");
                a.attr("dropdown-toggle","");
                a.addClass("dropdown-toggle");

                if(menuItem.children.length){
                    var ul = angular.element("<ul class=\"dropdown-menu\" role=\"menu\"></ul>");
                    li.append(ul);
                    angular.forEach(menuItem.children, function(childMenu){
                        _buildMenuItem(childMenu,ul);
                    });
                }
            }
        }else{
            if(menuItem.children.length){
                angular.forEach(menuItem.children, function(childMenu){
                    _buildMenuItem(childMenu,el);
                });
            }
        }
    }

    var $httpProviderRef, $stateProviderRef;

    angular.module("noinfopath.ui")
        .config(['$httpProvider', '$stateProvider', function($httpProvider, $stateProvider){
            $httpProviderRef = $httpProvider;
            $stateProviderRef = $stateProvider;
        }])

        .provider("noArea", [function(){
            var _menuConfig = [];

            function NoArea($state, $rootScope, $q, noConfig, _, noMenuData){

                function _noMenuRecurse(root, menu){
                    var m;
                    if(root.noMenu){
                        menu.push(m = new MenuItem(root.noMenu));

                        if(root.noMenu.state){
                            angular.noop();
                        }else{
                            angular.forEach(root.childAreas, function(area, name){
                                if(area.noMenu){
                                        m.children.push(new MenuItem(area.noMenu));
                                    // if(area.childAreas && area.childAreas.length > 0){
                                    // 	_noMenuRecurse(area, menu);
                                    // }
                                }
                            });
                        }

                    }else{
                        angular.forEach(root.childAreas, function(area){
                            _noMenuRecurse(area, menu);
                        });
                    }
                }

                function _routeRecurse(root){
                    if(root.route){
                        if(!root.route.data){
                            root.route.data = {};
                        }

                        root.route.data.title = root.title;

                        if(root.noComponents){
                            root.route.data.noComponents = root.noComponents;
                        }

                        if(root.noDataSources){
                            root.route.data.noDataSources = root.noDataSources;
                        }

                        // if(root.noDataSources){
                        // 	root.route.onEnter = _resolveData.bind(null, root.noDataSources);
                        // }

                        $stateProviderRef.state(root.route);
                    }

                    if(root.childAreas){
                        angular.forEach(root.childAreas, function(area){
                            _routeRecurse(area);
                        });
                    }
                }

                function _resolveData(dataSources){
                    console.log("resolveData", dataSources);
                }

                function _start(){

                    if(!_) throw "lodash is required.";
                    if(!noConfig) throw "noConfig is required.";
                    if(!$stateProviderRef) throw "$stateProviderRef is required.";
                    if(!noMenuData) throw "noMenuData is required.";

                    var noArea2 = noConfig.current.noArea2;
                    _noMenuRecurse(noArea2, noMenuData);
                    _routeRecurse(noArea2);
                    $rootScope.noAreaReady = true;
                }

                this.whenReady = function(){
                    return $q(function(resolve, reject){
                        if($rootScope.noAreaReady){
                            resolve();
                        }else{
                            $rootScope.$watch("noAreaReady", function(newval){
                                if(newval){
                                    resolve();
                                }
                            });

                            _start();
                        }
                    });
                };

                Object.defineProperties(this, {
                    "menuConfig": {
                        "get": function() { return noMenuData; }
                    }
                });
            }

            this.$get = ['$state','$rootScope', '$q', 'noConfig', 'lodash', function($state, $rootScope, $q, noConfig, _){
                return new NoArea($state, $rootScope, $q, noConfig, _, _menuConfig);
            }];
        }])

        .directive("noAreaMenu", ["noArea", "$compile", "lodash", function(noArea, $compile, _){
            var directive = {
                restrict: "A",
                transclude: true,
                compile: function(el, attrs){
                    _buildMenuItem(new MenuItem("","",noArea.menuConfig), el);

                    return function(scope, el, attrs){
                    };
                }
            };

            return directive;
        }])
    ;

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
            };
        }])

    ;
})(angular);

//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state){


            function _link(scope, el, attrs){

                function _finish(form){
					var config =  noInfoPath.getItem(form, attrs.noForm),
						dataSource = noDataSource.create(config.noDataSource, scope, scope),
                        lookup = config.noLookup,
                        sel = angular.element("<select></select>");

                        sel.addClass("form-control");

                        //sel.attr("ng-model", lookup.ngModel);

                        //sel.attr("ng-options", opts);


                        dataSource.read()
                            .then(function(data){
                                var items = data.paged,
                                    id = noInfoPath.getItem(scope, lookup.ngModel);

                                for(var i in items){
                                    var item = items[i],
                                        o = angular.element("<option></option>"),
                                        v = item[lookup.valueField];

                                    o.attr("value", v);
                                    o.append(item[lookup.textField]);

                                    if(v === id){
                                        o.attr("selected", "selected");
                                    }

                                    sel.append(o);
                                }

                                el.append(sel);


                                el.html($compile(el.contents())(scope));

                                scope.waitingFor[config.scopeKey] = false;
                            })
                            .catch(function(err){
                                scope.waitingForError = {error: err, src: config };
                                console.error(scope.$root.waitingForError);
                            });

				}

				noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
					.then(_finish)
					.catch(function(err){
						console.error(err);
					});


            }

            function _compile(el, attrs){
                return _link;
            }

            directive = {
                restrict:"E",
                compile: _compile,
                scope: false
            };

            return directive;
        }])
    ;
})(angular);

//tabs.js
(function(angular){
    angular.module("noinfopath.ui")
        .directive("noTabs",[ "$compile", function($compile){
            var link = function(scope, el, attrs){
                var lis = el.find("li"),
                    pnls = el.find("no-tab-panels").children(),
                    def = el.find("li.active"), defNdx;

                pnls.addClass("ng-hide");

                angular.forEach(lis, function(li, ndx){
                    angular.element(li).attr("ndx", ndx);
                    //console.log(ndx, li);
                });

                lis.click(function(e){
                    e.preventDefault();

                    var tab = el.find("li.active"),
                        pnlNdx = Number(tab.attr("ndx")),
                        pnl = angular.element(pnls[pnlNdx]);

                    tab.toggleClass("active");
                    pnl.toggleClass("ng-hide");

                    tab = angular.element(e.target).closest("li");
                    pnlNdx = Number(tab.attr("ndx"));
                    pnl = angular.element(pnls[pnlNdx]);

                    tab.toggleClass("active");
                    pnl.toggleClass("ng-hide");

                    //console.log()
                });

                //$compile(el.contents())(scope);

                //Show defaul tab panel
                defNdx = Number(def.attr("ndx"));
                angular.element(pnls[defNdx]).toggleClass("ng-hide");

            },

            directive = {
                restrict:"E",
                link:link
            };

            return directive;
        }])

    ;
})(angular);

//btn-group.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBtnGroup",["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state){
            function _link(scope, el, attrs){

                function _finish(form){
					var config =  noInfoPath.getItem(form, attrs.noForm),
						dataSource = noDataSource.create(config.noDataSource, scope, scope),
                        template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="\'{{v.{noValueField}}}\'">{{v.{noTextField}}}</label></div>',
                        btnGrp = config.noBtnGroup;

                        template = template.replace("{noBtnGroup}",  btnGrp.groupCSS);
    					template = template.replace("{noDataSource}",  config.scopeKey);
    					template = template.replace("{noItemClass}",  btnGrp.itemCSS);
    					template = template.replace("{noValueField}",  btnGrp.valueField);
    					template = template.replace("{noTextField}",  btnGrp.textField);
                        template = template.replace("{noNgModel}",  btnGrp.ngModel);

    	                el.append(angular.element(template));

                        el.html($compile(el.contents())(scope));

                        dataSource.read()
                            .then(function(data){
                                scope[config.scopeKey] = data.paged;
                                scope.waitingFor[config.scopeKey] = false;
                            })
                            .catch(function(err){
                                scope.waitingForError = {error: err, src: config };
                                console.error(scope.$root.waitingForError);
                            });

				}

				noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
					.then(_finish)
					.catch(function(err){
						console.error(err);
					});

            }


            directive = {
                restrict:"EA",
                scope: false,
                compile: function(el, attrs){


					return _link;
				}
            };

            return directive;
        }])
    ;
})(angular);

//data-panel.js
(function(angular, undefined){
    angular.module("noinfopath.ui")
        /*
        *   ##  noDataPanel
        *
        *   Renders a data bound panel that can contain
        *   any kind of HTML content, which can be bound
        *   data on $scope.  The data sources being bound
        *   to, are NoInfoPath Data Providers. Note that
        *   this directive calls noDataSource.one method,
        *   only returns a single data object, not an array.
        *
        *   ### Sample Usage
        *
        *   This sample show how to use the noDataPanel
        *   directive in your HTML markup.
        *
        *   ```html
        *   <no-data-panel no-config="noForms.trialPlot.noComponents.selection"/>
        *   ```
        *
        *   ### Sample Configuration
        *
        *   ```js
        *   {
        *       "selection": {
        *           "scopeKey": "selection",
        *           "dataProvider": "noWebSQL",
        *           "databaseName": "FCFNv2",
        *           "entityName": "vw_trialplot_selection",
        *           "primaryKey": "TrialPlotID",
        *           "lookup": {
        *               "source": "$stateParams",
        *           },
        *           "templateUrl": "observations/selection.html"
        *       }
        *   }
        *   ```
        */
        .directive("noDataPanel", ["$injector", "$q", "$http", "$compile", "noFormConfig", "noDataSource", "$state", function($injector, $q, $http, $compile, noFormConfig, noDataSource, $state){

            function _link(scope, el, attrs){
                var config,
                    dataSource,
                    noFormAttr = attrs.noForm;

                function finish(data){
                    scope[config.scopeKey] = data;

                    if(config.hiddenFields){
                        for(var h in config.hiddenFields){
                            var hf = config.hiddenFields[h],
                                value = noInfoPath.getItem(scope, hf.scopeKey);

                            //console.log(hidden);
                            noInfoPath.setItem(scope, hf.ngModel, value);
                        }
                    }

                    if(scope.waitingFor ) {
                        scope.waitingFor[config.scopeKey] = false;
                    }


                }

                function error(err){
                    scope.waitingForError = {error: err, src: config };

                    console.error(scope.$root.waitingForError);
                }

                function noForm_ready(data){
                    config = noInfoPath.getItem(data, noFormAttr);

                    if(config.noDataPanel && config.noDataPanel.refresh){
                        scope.$watchCollection(config.noDataPanel.refresh.property, function(newval, oldval){
                            if(newval){
                                dataSource.one()
                                    .then(finish)
                                    .catch(error);
                            }
                        });
                    }

                    if(config.noDataSource){
                        dataSource = noDataSource.create(config.noDataSource, scope);
                    }else{
                        dataSource = noDataSource.create(config, scope);
                    }

                    if(config.templateUrl){
                        $http.get(config.templateUrl)
                            .then(function(resp){
                                var t = $compile(resp.data),
                                    params = [],
                                    c = t(scope);

                                el.append(c);

                                dataSource.one()
                                    .then(finish)
                                    .catch(error);
                            });
                    }else{
                        dataSource.one()
                            .then(finish)
                            .catch(error);
                    }
                }


                noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
                    .then(noForm_ready)
                    .catch(error);
            }

            return {
                restrict: "E",
                link: _link,
                scope: false
            };
        }])
    ;
})(angular);

//alpha-filter.js
(function(angular, undefined){
    "use strict";

    angular.module("noinfopath.ui")
        .directive("noAlphaNumericFilter", [function(){

            function _link(scope, el, attrs){
                var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    nav = angular.element("<nav></nav>"),
                    ul = angular.element('<ul class="pagination pagination-sm"></ul>'),
                    itemOpen =  '<li><span>',
                    itemClose1 =  '<span class="sr-only">',
                    itemClose2 =  '</span></li>';

                function _click(e){
                    var letter = angular.element(e.currentTarget);
                    scope.noAlphaNumericFilter = letter.text();
                    el.find("li").removeClass("active");
                    letter.addClass("active");
                    scope.$apply();
                }

                scope.noAlphaNumericFilter = "A";

                nav.append(ul);
                el.append(nav);

                for(var l=0; l < letters.length; l++){
                    var tmp = angular.element(itemOpen + letters[l] + itemClose2);
                    if(l === 0){
                        tmp.addClass("active");
                    }
                    ul.append(tmp);
                    tmp.click(_click);
                }


            }

            return {
                restrict: "E",
                scope: false,
                link: _link
            };
        }])
    ;
})(angular);

//title.js
(function(angular, undefined){
    "use strict";

    angular.module("noinfopath.ui")
        .directive("noTitle", ["noDataSource", "noFormConfig", "$compile", "noConfig",  "lodash", function(noDataSource, noFormConfig, $compile, noConfig,  _){
            function _link(scope, el, attrs){
                scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
                    var noFormCfg, noTitle;

                    function _finish(data){
                        if(!data) throw "Form configuration not found for route " + toState.name;

                        noTitle = data.noTitle;

                        if(noTitle){
                            el.html($compile(noTitle.title)(event.targetScope));
                            if(noTitle.noDataSource){
                                var dataSource = noDataSource.create(noTitle.noDataSource, event.targetScope);

                                dataSource.one()
                                    .then(function(data){
                                        noInfoPath.setItem(event.targetScope, "noTitle." + noTitle.scopeKey , data[noTitle.scopeKey]);
                                    })
                                    .catch(function(err){
                                        console.error(err);
                                    });
                            }
                        }
                    }

                    noFormConfig.getFormByRoute(toState.name, toParams.entity, scope)
                        .then(_finish);

                });

            }

            return {
                restrict: "E",
                scope: true,
                link: _link

            };
        }])
    ;
})(angular);

//back-button.js
(function(angular, undefined){
    "use strict";

    angular.module("noinfopath.ui")
        .run(["$rootScope", function($rootScope){
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                console.log("$stateChangeSuccess");
                event.currentScope.$root.noNav = event.currentScope.$root.noNav ? event.currentScope.$root.noNav : {};
                event.currentScope.$root.noNav[fromState.name] = fromParams;
            });

        }])
        .directive("noNav", ["$state", "noFormConfig", function( $state, noFormConfig){

            function _click(nav, attr, scope, $state) {
                var route = noInfoPath.getItem(nav, attr),
                    params = scope.$root.noNav[route];

                params = params ? params : {};

                if(attr === "new" && route == "vd.entity.edit"){
                    params.entity = $state.params.entity;
                    params.id = "";
                }
                //console.log(route, params);
                $state.go(route, params);
            }

            function _link(scope, el, attrs){
                function _finish(data) {
                    el.click(_click.bind(el, data.noNav, attrs.noNav, scope, $state));
                }

                noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
                    .then(_finish);


            }

            return {
                restrict: "A",
                scope: {},
                link: _link
            };
        }])
    ;
})(angular);
