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
	function NoListSourceDirective($q, $state, noFormConfig, noDataSource){
		function _link(scope, el, attrs, select) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noListSource", attrs.noForm),
				lookup = ctx.component.noLookup,
				dataSource = noDataSource.create(ctx.component.noDataSource, scope),
				sel = el
				;

			scope.$parent[ctx.component.scopeKey] = {
				refresh: function(dataSource, sel, lookup, select) {
					function __render(data) {
						scope.$parent[ctx.component.scopeKey].data = data;
						sel.empty();
						//select.addOption("", sel.append("<option value=\"\" selected></option>"));
						data.paged.forEach(function(data, k){
							var selected = k === 0 ? " selected" : "";

							select.addOption(data[lookup.valueField], sel.append("<option value=\"" + data[lookup.valueField] + "\">" + data[lookup.textField] + "</option>"));
						});

					}

					if(lookup.useRefData) {
						__render(new noInfoPath.data.NoResults(scope.$root.refData[lookup.useRefData]));
						return $q.when(true);
					} else {
						return dataSource.read()
							.then(__render)
							.catch(function(err) {
								return err;
							});

					}
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
		.directive("noListSource", ["$q", "$state", "noFormConfig", "noDataSource", NoListSourceDirective])
	;
})(angular);
