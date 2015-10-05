//btn-group.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBtnGroup",["$compile", "noConfig", "noDataSource", function($compile, noConfig, noDataSource){
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


            directive = {
                restrict:"EA",
                scope: false,
                compile: function(el, attrs){
					var template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="\'{{v.{noValueField}}}\'">{{v.{noTextField}}}</label></div>',
						config = noInfoPath.getItem(noConfig.current, attrs.noConfig);
                        btnGrp = config.noBtnGroup;

                    template = template.replace("{noBtnGroup}",  btnGrp.groupCSS);
					template = template.replace("{noDataSource}",  config.scopeKey);
					template = template.replace("{noItemClass}",  btnGrp.itemCSS);
					template = template.replace("{noValueField}",  btnGrp.valueField);
					template = template.replace("{noTextField}",  btnGrp.textField);
                    template = template.replace("{noNgModel}",  btnGrp.ngModel);

	                el.append(angular.element(template));

					return _link;
				}
            };

            return directive;
        }])
    ;
})(angular);
