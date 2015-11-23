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
                //console.log("$stateChangeSuccess");
                event.currentScope.$root.noNav = event.currentScope.$root.noNav ? event.currentScope.$root.noNav : {};
                event.currentScope.$root.noNav[fromState.name] = fromParams;
            });

        }])

        .directive("noNav", ["$q", "$state", "noFormConfig", "$noForms", function($q, $state, noFormConfig, $noForms){

            function _link(scope, el, attrs){
                var navFns = {
                    "home": function(){
                        var route = noInfoPath.getItem(config.noNavBar.routes, attrs.noNav);

                        $state.go(route);
                    },
                    "back": function(){
                        var route = noInfoPath.getItem(config.noNavBar.routes, attrs.noNav),
                            params = {
                                entity: $state.params.entity
                            };

                        $state.go(route, params);
                    },
                    "writeable": function() {
                        $noForms.showNavBar($noForms.navBarNames.WRITEABLE);
                    },
                    "new": function(){
                        var route = noInfoPath.getItem(config.noNavBar.routes, attrs.noNav),
                            params = scope.$root.noNav[route];

                        params = params ? params : {};

                        if(attrs.noNav === "new" && route == "vd.entity.edit"){
                            params.entity = $state.params.entity;
                            params.id = "";
                        }
                        //console.log(route, params);
                        if(route) $state.go(route, params);

                    },
                    "undo": function(){
                        $noForms.showNavBar($noForms.navBarNames.READONLY);
                    },
                    "undefined": function() {}
                },
                config, html;

                function saveConfig(c){
                    config = c;
                    console.log(config);
                    return $q.when(config);
                }

                function click() {
                    var navFnKey = attrs.noNav,
                        navFn = navFns[navFnKey];

                    if(!navFn) navFn = navFns["undefined"];

                    navFn(config.noNavBar.routes[navFnKey], $state.params);

                }

                function finish() {
                    el.click(click);
                }

                noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
                    .then(saveConfig)
                    .then(finish)
                    .catch(function(err){
                        console.error(err);
                    });


            }

            return {
                restrict: "A",
                scope: {},
                link: _link
            };
        }])

        .service("$noForms", ["$rootScope", function($rootScope){
            this.navBarNames = {
                BASIC: "basic",
                SEARCH: "search",
                READONLY: "readonly",
                WRITEABLE: "writeable",
                CREATE: "create"
            };

            $rootScope.$on("noSubmit::success", function(){
                 //Assume we are in edit mode.
                this.showNavBar(this.navBarNames.READONLY);
            }.bind(this));

            $rootScope.$on("noReset::click", function(){
                 //Assume we are in edit mode.
                this.showNavBar(this.navBarNames.READONLY);
            }.bind(this));

            this.showNavBar = function (targetNavBar){
                if(!targetNavBar) throw "targetNavBar is a required parameter";

                var el = angular.element("no-form, .no-search");
                el.find("[no-navbar]").addClass("ng-hide");
                el.find("[no-navbar='" + targetNavBar + "']").removeClass("ng-hide");

                //Make form readonly when required.
                switch(targetNavBar){
                    case this.navBarNames.READONLY:
                        angular.element(".no-editor-cover").removeClass("ng-hide");
                        break;
                    case this.navBarNames.WRITEABLE:
                    case this.navBarNames.CREATE:
                        angular.element(".no-editor-cover").addClass("ng-hide");
                        break;
                }

            };

            this.navBarNameFromState = function (stateName, id){
                if(!stateName) throw "stateName is a required parameter";

                var navBar = "";

                switch(stateName){
                    case "vd.entity.search":
                        navBar = "search";
                        break;
                    case "vd.entity.edit":
                        navBar = id ? "readonly" : "create";
                        break;
                    default:
                        navBar = "basic";
                        break;
                }

                return navBar;
            };
        }])

        .directive("noNavBar", ["$q", "$compile", "$http", "$state", "noFormConfig", "$noForms", function($q, $compile, $http, $state, noFormConfig, $noForms){

            function _link(scope, el, attrs){
                var config, html;

                function saveConfig(c){
                    config = c;
                    console.log(config);
                    return $q.when(config);
                }

                function getTemplate(){
                    return $http.get("no-navbar.tpl.html")
                        .then(function(resp){
                            html = resp.data;
                            html = html.replace(/{noNavBar\.scopeKey\.readOnly}/g, config.noNavBar.scopeKey.readOnly);
                            html = html.replace(/{noNavBar\.scopeKey\.writeable}/g, config.noNavBar.scopeKey.writeable);
                            html = $compile(html)(scope);
                            el.html(html);
                            return ;
                        });

                }

                function finish(){


                    var cnb = $noForms.navBarNameFromState($state.current.name, $state.params.id);


                    $noForms.showNavBar(cnb);

                    return;
                }

                noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
                    .then(saveConfig)
                    .then(getTemplate)
                    .then(finish)
                    .catch(function(err){
                        console.error(err);
                    });
            }

            return {
                restrict: "E",
                link: _link
            };
        }])

        .directive("noReadOnly", [function(){
			function _link(scope, el, attrs){
				el.append("<div class=\"no-editor-cover\"></div>");
			}

			return {
				restrict: "A",
				link: _link
			};
		}])

    ;
})(angular);
