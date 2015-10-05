//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "noConfig", "noDataSource", function($compile, noConfig, noDataSource){


            function _link(scope, el, attrs){
                var config = noInfoPath.getItem(noConfig.current, attrs.noConfig),
                    dataSource = noDataSource.create(config.noDataSource, scope);

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

            function _compile(el, attrs){
                var config = noInfoPath.getItem(noConfig.current, attrs.noConfig),
                    lookup = config.noLookup,
                    sel = angular.element("<select></select>"),
                    opts = "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + config.scopeKey;

                sel.addClass("form-control");

                sel.attr("ng-model", lookup.ngModel);

                sel.attr("ng-options", opts);


                el.append(sel);

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
