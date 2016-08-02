(function(angular) {
	angular.module("noinfopath.ui")
		.directive("noTabs", ["$compile", "$state", "noFormConfig", "noDataSource", function($compile, $state, noFormConfig, noDataSource) {
			function _static(scope, el, attrs) {
				console.log("static");
				var ul = el.find("ul")
					.first(),
					lis = ul.length > 0 ? ul.children() : null,
					pnls = el.find("no-tab-panels")
					.first()
					.children("no-tab-panel"),
					def = ul.find("li.active"),
					defNdx;

				pnls.addClass("ng-hide");

				el.find("no-tab-panels")
					.first()
					.addClass("tab-panels");

				el.find("no-tab-panels > no-tab-panel > div")
					.addClass("no-m-t-lg");

				for (var lii = 0, ndx = 0; lii < lis.length; lii++) {
					var lie = angular.element(lis[lii]);

					if (!lie.is(".filler-tab")) {
						lie.attr("ndx", ndx++);
					}
				}

				lis.find("a:not(.filler-tab)")
					.click(function(e) {
						e.preventDefault();


						var ul = el.find("ul")
							.first(),
							tab = ul.find("li.active"),
							pnlNdx = Number(tab.attr("ndx")),
							pnl = angular.element(pnls[pnlNdx]);

						tab.toggleClass("active");
						pnl.toggleClass("ng-hide");

						tab = angular.element(e.target)
							.closest("li");
						pnlNdx = Number(tab.attr("ndx"));
						pnl = angular.element(pnls[pnlNdx]);

						tab.toggleClass("active");
						pnl.toggleClass("ng-hide");

						scope.$broadcast("noTabs::Change", tab, pnl);
					});

				//$compile(el.contents())(scope);

				//Show defaul tab panel
				defNdx = Number(def.attr("ndx"));
				angular.element(pnls[defNdx])
					.toggleClass("ng-hide");

			}

			function _resolveOrientation(noTab) {
				var ul = "nav nav-tabs";

				switch (noTab.orientation.toLowerCase()) {
					case "left":
						ul = "nav nav-tabs tabs-left col-sm-2";
						break;
					case "left-flex":
						ul = "nav nav-tabs tabs-left";
						break;
				}
				return ul;
			}

			function _dynamic(noTab, scope, el, attrs) {
				var ds = noDataSource.create(noTab.noDataSource, scope);

				ds.read()
					.then(function(data) {
						var ul = el.find("ul")
							.first(),
							pnls = el.find("no-tab-panels")
							.first();

						ul.addClass(_resolveOrientation(noTab.noTabs));

						//pnls.addClass("ng-hide");

						el.find("no-tab-panels")
							.first()
							.addClass("tab-panels");

						if(noTab.noTabs.orientation !== "left-flex") {
							el.find("no-tab-panels")
								.first()
								.addClass("col-sm-10");

							el.find("no-tab-panels > no-tab-panel > div")
								.addClass("no-m-t-lg");
						}


						for (var i = 0, ndx = 0; i < data.length; i++) {
							var li = angular.element("<li></li>"),
								a = angular.element("<a href=\"\#\"></a>"),
								datum = data[i];
							if (i === 0) {
								li.addClass("active");
							}
							li.attr("ndx", datum[noTab.noTabs.valueField]);
							a.text(datum[noTab.noTabs.textField]);

							li.append(a);

							ul.append(li);
						}

						ul.find("li")
							.click(function(e) {
								e.preventDefault();

								var ul = el.find("ul")
									.first(),
									tab = ul.find("li.active");
								//pnlNdx = Number(tab.attr("ndx")),
								//pnl = angular.element(pnls[pnlNdx]);

								tab.toggleClass("active");
								//pnl.toggleClass("ng-hide");

								tab = angular.element(e.target)
									.closest("li");

								// pnlNdx = Number(tab.attr("ndx"));
								// pnl = angular.element(pnls[pnlNdx]);

								tab.toggleClass("active");
								//pnl.toggleClass("ng-hide");

								scope.$broadcast("noTabs::Change", tab, pnls, noTab);
							});

						var tab = el.find("ul").find("li.active"),
							pnl = el.find("no-tab-panels").first();

						scope.$broadcast("noTabs::Change", tab, pnl, noTab);
					});
			}

			function _link(scope, el, attrs) {
				var noForm = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
					noTab = noInfoPath.getItem(noForm, attrs.noForm);

				if (noTab) {
					_dynamic(noTab, scope, el, attrs);
				} else {
					_static(scope, el, attrs);
				}
			}

			return {
				restrict: "E",
				link: _link
			};
		}])

	;
})(angular);
