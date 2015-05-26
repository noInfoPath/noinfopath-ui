//btn-group.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBtnGroup",["$compile", "$state", "noSessionStorage", function($compile, $state, noSessionStorage){
            function _link(scope, el, attrs){
                if(!$state.current.data) throw "Current state ($state.current.data) is expected to exist.";
                if(!$state.current.data.noDataSources) throw "Current state is expected to have a noDataSource configuration.";

                var dsConfig = $state.current.data.noDataSources[attrs.noDataSource],
                    ds = new window.noInfoPath.noDataSource("noDataService", dsConfig, $state.params, scope),
                    req = {
                        data: {
                            "sort": [{"field": "Description", "dir": "asc"}]
                        }
                    };

                ds.transport.read(req)
                    .then(function(data){
                        scope[attrs.noDataSource] = data;
                    })
                    .catch(function(err){
                        console.error(err);
                    })                
            }

            function _compile(el, attrs){
                var template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="{{v.{noValueField}}}">{{v.{noTextField}}}</label></div>';

                angular.forEach(attrs.$attr, function(attr, name){
                    template = template.replace("{" +name + "}",  attrs[name]);
                })
                              
                el.append(angular.element(template));

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
