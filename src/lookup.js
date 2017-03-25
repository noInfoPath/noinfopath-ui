//lookup.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noLookup", ["$compile", "noFormConfig", "noDataSource", "$state", "noNCLManager", function($compile, noFormConfig, noDataSource, $state, noNCLManager) {
		function _compile(el, attrs) {
			var config, form, lookup, ncl, sel = angular.element("<select />"), noid = el.parent().parent().attr("noid");

			function useNacl() {
				config = noNCLManager.getHashStore($state.params.fid || $state.current.name.split(".").pop()); // designer vs viewer
				ncl = config.get(noid);
				form = ncl.noComponent;
				lookup = form.noLookup;

				renderNgOptions();

				if (lookup.required || (ncl && ncl.noElement.validators && ncl.noElement.validators.required)) sel.attr("required", "");

				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
					//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
				} else {
					sel.attr("ng-model", lookup.ngModel || (ncl && ncl.noComponent && ncl.noComponent.ngModel) ); //TODO replace with smarter logic

				}

			}

			function useFormConfig() {
				config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity);
				form = noInfoPath.getItem(config, attrs.noForm);
				lookup = form.noLookup;

				renderNgOptions();

				if (lookup.required) sel.attr("required", "");

				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
					//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
				} else {
					sel.attr("ng-model", lookup.ngModel); //TODO replace with smarter logic
					sel.attr("name", lookup.name);
					el.attr("name", lookup.name);
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

			if(noid) {
				useNacl();
			} else {
				useFormConfig();
			}


			//default to bootstrap
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
