//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state){


            function _link(scope, el, attrs){

                function _finish(form){
					var config =  noInfoPath.getItem(form, attrs.noForm),
						dataSource = noDataSource.create(config.noDataSource, scope, scope),
                        template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="\'{{v.{noValueField}}}\'">{{v.{noTextField}}}</label></div>',
                        lookup = config.noLookup,
                        sel = angular.element("<select></select>"),
                        opts = "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + config.scopeKey;

                        sel.addClass("form-control");

                        sel.attr("ng-model", lookup.ngModel);

                        sel.attr("ng-options", opts);


                        el.append(sel);

                        // sel.change(function(){
                        //     console.log(scope.observation);
                        // });

                        dataSource.read()
                            .then(function(data){
                                scope[config.scopeKey] = data.paged;
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
