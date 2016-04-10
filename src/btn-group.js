//btn-group.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noBtnGroup", ["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state) {
		function _link(scope, el, attrs) {
			function valueField(btn) {
				var to = btn.valueType ? btn.valueType : "string",
					fns = {
						"string": function(vf) {
							return "'{{v." + btn.valueField + "}}'";
						},
						"undefined": function(vf) {
							return "{{v." + btn.valueField + "}}";
						}
					},
					fk = fns[to] ? to : "undefined",
					fn = fns[fk];

				return fn(btn);
			}

			function _finish(form) {
				var config = noInfoPath.getItem(form, attrs.noForm),
					dataSource = noDataSource.create(config.noDataSource, scope, scope),
					template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="{noValueField}">{{v.{noTextField}}}</label></div>',
					btnGrp = config.noBtnGroup;

				template = template.replace("{noBtnGroup}", btnGrp.groupCSS);
				template = template.replace("{noDataSource}", config.scopeKey);
				template = template.replace("{noItemClass}", btnGrp.itemCSS);
				template = template.replace("{noValueField}", valueField(btnGrp));
				template = template.replace("{noTextField}", btnGrp.textField);
				template = template.replace("{noNgModel}", btnGrp.ngModel);

				el.append(angular.element(template));

				el.html($compile(el.contents())(scope));

				dataSource.read()
					.then(function(data) {
						scope[config.scopeKey] = data.paged;
						scope.waitingFor[config.scopeKey] = false;
					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.$root.waitingForError);
					});

			}

			_finish(noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope));


		}


		directive = {
			restrict: "EA",
			scope: false,
			compile: function(el, attrs) {


				return _link;
			}
		};

		return directive;
        }]);
})(angular);
