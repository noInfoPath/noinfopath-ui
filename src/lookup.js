//lookup.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noLookup", ["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state) {


		function _link(scope, el, attrs) {

			function populateDropDown(config, lookup) {
				var dataSource = noDataSource.create(config.noDataSource, scope, scope);

				dataSource.read()
					.then(function(data) {
						var items = data.paged,
							id = noInfoPath.getItem(scope, lookup.ngModel),
							sel = el.find("select");

						sel.empty();
						sel.append("<option></option>");


						for (var i = 0; i < items.length; i++){
							var item = items[i],
								o = angular.element("<option></option>"),
								v = item[lookup.valueField];

							o.attr("value", v);
							o.append(item[lookup.textField]);

							if (v === id) {
								o.attr("selected", "selected");
							}

							sel.append(o);
						}


					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.$root.waitingForError);
					});

			}

			function _finish(form) {
				var config = noInfoPath.getItem(form, attrs.noForm),
					dataSource = noDataSource.create(config.noDataSource, scope, scope),
					lookup = config.noLookup,
					sel = angular.element("<select></select>");



				//For kendo compatiblity
				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
					//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
				} else {
					//sel.attr("ng-model", lookup.ngModel);
				}


				el.append(sel);
				sel.addClass("form-control");


				el.html($compile(el.contents())(scope));


				//For kendo compatiblity
				if (lookup.binding && lookup.binding === "kendo") {
					sel.change(function() {
						scope[lookup.scopeKey].set(lookup.valueField, angular.element(this).val());
						scope[lookup.scopeKey].dirty = true;
					});
				} else {
					sel.change(function() {
						noInfoPath.setItem(scope, lookup.ngModel, angular.element(this).val());
						scope.$apply();
                        //this.remove(0);
					});
				}

				if (lookup.watch) {
					scope.$watch(lookup.watch.property, function(n, o, s) {
						if (n) {
							populateDropDown(config, lookup);
						}
					});
				} else {
					populateDropDown(config, lookup);
				}

				//scope.waitingFor[config.scopeKey] = false;


			}

			noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
				.then(_finish)
				.catch(function(err) {
					console.error(err);
				});


		}

		function _compile(el, attrs) {
			return _link;
		}

		directive = {
			restrict: "E",
			compile: _compile,
			scope: false
		};

		return directive;
	}]);
})(angular);
