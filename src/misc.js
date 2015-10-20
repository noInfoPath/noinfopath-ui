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
