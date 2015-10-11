//alpha-filter.js
(function(angular, undefined){
    "use strict";

    angular.module("noinfopath.ui")
        .directive("noAlphaNumericFilter", [function(){
            function _compile(el, attrs){
                var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    nav = angular.element("<nav></nav>"),
                    ul = angular.element('<ul class="pagination pagination-sm"></ul>'),
                    itemOpen =  '<li><a href="#">',
                    itemClose =  ' <span class="sr-only">(current)</span></a></li>';

                for(var l=0; l < letters.length; l++){
                    var tmp = angular.element(itemOpen + letters[l] + itemClose);
                    ul.append(tmp);
                }
                nav.append(ul);
                el.append(nav);
                return _link;
            }

            function _link(scope, el, attrs){

            }

            return {
                restrict: "E",
                scope: false,
                compile: _compile
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
        .directive("noBackButton", ["$state", function($state){
            return {
                restrict: "AE",
                scope: {},
                compile: function (el, attrs){

                    return function (scope, el, attrs){
                        function _click(scope, $state) {
                            console.warn("TODO: finish click handler");

                            $state.go(scope.noBackButton.state.name, scope.noBackButton.params);
                        }

                        el.click(_click.bind(el, scope, $state));

                        scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
                            event.currentScope.noBackButton = {state: fromState, params: fromParams };

                        });

                    };
                }
            };
        }])
    ;
})(angular);
