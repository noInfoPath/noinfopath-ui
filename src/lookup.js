//lookup.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noLookup", ["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state) {
		function _compile(el, attrs) {
			var config, form, lookup, ncl, sel = angular.element("<select />"), noid = el.parent().parent().attr("noid");

			function useFormConfig() {
				config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity);
				form = noInfoPath.getItem(config, attrs.noForm);
				lookup = form.noLookup;

				renderNgOptions();

				if (lookup.required) sel.attr("required", "");

				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
				} else {
					sel.attr("ng-model", lookup.ngModel); //TODO replace with smarter logic
				}
			}

			function renderNgOptions() {
				if(angular.isArray(lookup.textField)){
					var textFields = [];

					for (i = 0; i < lookup.textField.length; i++){
						var item = "item." + lookup.textField[i];

						textFields.push(item);
					}

					sel.attr("ng-options", "item." + lookup.valueField + " as " + textFields.join(" + ' ' + ") + " for item in " + form.scopeKey);
				} else {
					sel.attr("ng-options", "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + form.scopeKey);
				}
			}

			useFormConfig();

			sel.addClass(lookup.cssClasses || "form-control");

			el.empty();
			el.append(sel);

			return _link.bind(null, { config: config, form: form, lookup: lookup });
		}


		function _link(ctx, scope, el, attrs) {
			var config = ctx.config,
				form = ctx.form,
				lookup = ctx.lookup,
				sel = el.first();

			function populateDropDown(form, lookup) {
				var dataSource = noDataSource.create(form.noDataSource, scope, scope);

				dataSource.read()
					.then(function(data) {
						scope[form.scopeKey] = data;

					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.waitingForError);
					});
			}
			populateDropDown(form, lookup);
		}

		directive = {
			restrict: "E",
			compile: _compile,
			scope: false
		};

		return directive;
	}]);

})(angular);