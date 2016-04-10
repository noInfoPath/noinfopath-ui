//lookup.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noLookup", ["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state) {
		function _compile(el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity),
				form = noInfoPath.getItem(config, attrs.noForm),
				lookup = form.noLookup,
				sel = angular.element("<select />");

			sel.attr("ng-options", "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + form.scopeKey);

			if (lookup.required) sel.attr("required", "");

			if (lookup.binding && lookup.binding === "kendo") {
				sel.attr("data-bind", "value:" + lookup.valueField);
				//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
			} else {
				sel.attr("ng-model", lookup.ngModel);

			}

			//default to bootstrap
			sel.addClass(lookup.cssClasses || "form-control");

			el.empty();
			el.append(sel);

			// if(attrs.$attr.required){
			//     var input = angular.element("<input />");
			//
			//     input.attr("type", "hidden");
			//     input.attr("required", "required");
			//
			//     input.attr("ng-model", attrs.noModel);
			//     input.attr("name", attrs.noModel);
			//
			//     el.append(input);
			// }
			return _link;
		}


		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity),
				form = noInfoPath.getItem(config, attrs.noForm),
				lookup = form.noLookup,
				sel = el.first();

			function populateDropDown(form, lookup) {
				var dataSource = noDataSource.create(form.noDataSource, scope, scope);

				dataSource.read()
					.then(function(data) {
						scope[form.scopeKey] = data;
						// var items = data.paged,
						// 	id = noInfoPath.getItem(scope, lookup.ngModel),
						// 	sel = el.find("select");
						//
						// sel.empty();
						// sel.append("<option></option>");
						//
						//
						// for (var i = 0; i < items.length; i++){
						// 	var item = items[i],
						// 		o = angular.element("<option></option>"),
						// 		v = item[lookup.valueField];
						//
						// 	o.attr("value", v);
						// 	o.append(item[lookup.textField]);
						//
						// 	if (v === id) {
						// 		o.attr("selected", "selected");
						// 	}
						//
						// 	sel.append(o);
						//}


					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.$root.waitingForError);
					});

			}

			// if (lookup.binding && lookup.binding === "kendo") {
			// 	sel.change(function() {
			// 		scope[lookup.scopeKey].set(lookup.valueField, angular.element(this).val());
			// 		scope[lookup.scopeKey].dirty = true;
			// 	});
			// } else {
			// 	sel.change(function() {
			// 		noInfoPath.setItem(scope, lookup.ngModel, angular.element(this).val());
			// 		scope.$apply();
			// 		//this.remove(0);
			// 	});
			// }

			// if (lookup.watch) {
			// 	scope.$watch(lookup.watch.property, function(n, o, s) {
			// 		if (n) {
			// 			populateDropDown(form, lookup);
			// 		}
			// 	});
			// }
			//else {
			//populateDropDown(form, lookup);
			// }

			// scope.$on("noKendoGrid::dataChanged", function(e, scopeKey){
			// 	if (lookup.watch && lookup.watch.property == scopeKey){
			// 		populateDropDown(config, lookup);
			// 	}
			// });

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
