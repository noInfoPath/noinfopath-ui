//btn-group.js
(function(angular, undefined) {
	/**
	*	### NoListSource Directive
	*
	*	Extends a standard select element to support noDataSource configuration
	* 
	*   #### HTML
	* 
	*   ```HTML
	*   <select no-list-source no-form="noForm.noComponents.states" class="form-control no-m-r-sm" ng-model="addressVw.state" name="state" placeholder="State" required style="width: 3.25em;"></select>
	*   ```
	*
	*	#### Configuration
	*
	*	```json
	*
	*	{
	*		"states": {
	*           "scopeKey": "states",
	*			"noDataSource": {
	*			    "dataProvider": "noHTTP",
	*			    "databaseName": "SOPDB",
	*			    "entityName": "us_states",
	*			    "primaryKey": "id",
	*			    "sort": [
	*                   {
	*					    "field": "code"
	*				    }
	*               ]
	*			},
	*			"noLookup": {
	*				"textField": "code",
	*				"valueField": "code",
	*				"ngModel": "newCompany.state",
	*				"name": "state",
	*				"required": true
	*			}
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

			dataSource.read()
				.then(function(data) {
					scope[ctx.component.scopeKey] = data;
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

		}

		return {
			restrict: "A",
			require: "?select",
			link: _link
		};

	}

	angular.module("noinfopath.ui")
		.directive("noListSource", ["$state", "noFormConfig", "noDataSource", NoListSourceDirective])
	;
})(angular);
