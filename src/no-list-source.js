//btn-group.js
(function(angular, undefined) {
	/**
	*	### NoCheckboxDirective
	*
	*	Extands a standard checkbox element to support noActionQueue configurations
	*	that are store in `area.json` files.
	*
	*
	*	#### Configuration
	*
	*	```json
	*
	*	{
	*		myButtonConfig: {
				"actions": [
	*				{
	*					"provider": "$state",
	*					"method": "go",
	*					"noContextParams": true,
	*					"params": [
	*						"efr.project.search",
	*						{
	*							"provider": "noStateHelper",
	*							"method": "makeStateParams",
	*							"params": [
	*								{
	*									"key": "id",
	*									"provider": "scope",
	*									"property": "document.ProjectID.ID"
	*								}
	*							],
	*							"passLocalScope": true
	*						}
	*					]
	*				}
	*			]
	*		}
	*	}
	*
	*	```
	*
	*/
	function NoListSourceDirective($state, noFormConfig, noDataSource){
		function _link(scope, el, attrs, select) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noListSource", attrs.noForm),
				lookup = ctx.component.noLookup,
				dataSource = noDataSource.create(ctx.component.noDataSource, scope),
				sel = el
				;

			scope.$parent[ctx.component.scopeKey] = {
				refresh: function(dataSource, sel, lookup, select) {
					return dataSource.read()
						.then(function(data) {
							scope.$parent[ctx.component.scopeKey].data = data;
							sel.empty();
							//select.addOption("", sel.append("<option value=\"\" selected></option>"));
							data.paged.forEach(function(data, k){
								var selected = k === 0 ? " selected" : "";

								select.addOption(data[lookup.valueField], sel.append("<option value=\"" + data[lookup.valueField] + "\">" + data[lookup.textField] + "</option>"));
							});
						})
						.catch(function(err) {
							return err;
							// scope.waitingForError = {
							// 	error: err,
							// 	src: config
							// };
						});
				}.bind(null, dataSource, sel, lookup, select)
			}

			scope.$parent[ctx.component.scopeKey].refresh();

		}

		return {
			restrict: "A",
			require: "?select",
			link: _link,
			scope: {
				"ngModel": "="
			}
		};

	}

	angular.module("noinfopath.ui")
		.directive("noListSource", ["$state", "noFormConfig", "noDataSource", NoListSourceDirective])
	;
})(angular);
