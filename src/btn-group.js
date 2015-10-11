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
