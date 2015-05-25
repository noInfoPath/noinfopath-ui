//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "$state", "noSessionStorage", function($compile, $state, noSessionStorage){


            function _link(scope, el, attrs){
                if(!$state.current.data) throw "Current state ($state.current.data) is expected to exist.";
                if(!$state.current.data.noDataSources) throw "Current state is expected to have a noDataSource configuration.";

                var dsConfig = $state.current.data.noDataSources[attrs.noDataSource],
                    ds = new window.noInfoPath.noDataSource("noDataService", dsConfig, $state.params, scope);

                window.noInfoPath.watchFiltersOnScope(attrs, dsConfig, ds, scope, $state);

                if(attrs.noDataSource){
                    scope[attrs.noDataSource] = []; //clear out array
                }
            }

            function _compile(el, attrs){
                var sel = angular.element("<select></select>")

                sel.addClass("form-control");
                sel.attr("ng-model", attrs.noNgModel);

                var opts = "item." + attrs.noValueField + " as item." + attrs.noTextField + " for item in " + attrs.noDataSource;

                sel.attr("ng-options", opts);

                el.append(sel);

                return _link;
            }

            directive = {
                restrict:"EA",
                //scope: {},
                compile: _compile
            }

            return directive;
        }])
    ;
})(angular);
