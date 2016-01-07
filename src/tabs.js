//tabs.js
(function(angular) {
	angular.module("noinfopath.ui")
		.directive("noTabs", ["$compile", function($compile) {
			var link = function(scope, el, attrs) {
					var ul = el.find("ul").first(),
						lis = ul.length > 0 ? ul.children() : null,
						pnls = el.find("no-tab-panels").first().children("no-tab-panel"),
						def = ul.find("li.active"),
						defNdx;


					pnls.addClass("ng-hide");

					el.find("no-tab-panels").first().addClass("tab-panels");

					el.find("no-tab-panels > no-tab-panel > div").addClass("no-m-t-lg");

					for (var lii = 0, ndx = 0; lii < lis.length; lii++) {
						var lie = angular.element(lis[lii]);

						if (!lie.is(".filler-tab")) {
							lie.attr("ndx", ndx++);
						}
					}

					lis.find("a:not(.filler-tab)").click(function(e) {
						e.preventDefault();


						var ul = el.find("ul").first(),
							tab = ul.find("li.active"),
							pnlNdx = Number(tab.attr("ndx")),
							pnl = angular.element(pnls[pnlNdx]);

						tab.toggleClass("active");
						pnl.toggleClass("ng-hide");

						tab = angular.element(e.target).closest("li");
						pnlNdx = Number(tab.attr("ndx"));
						pnl = angular.element(pnls[pnlNdx]);

						tab.toggleClass("active");
						pnl.toggleClass("ng-hide");

                        scope.$broadcast("noTabs::Change", tab, pnl);
					});

					//$compile(el.contents())(scope);

					//Show defaul tab panel
					defNdx = Number(def.attr("ndx"));
					angular.element(pnls[defNdx]).toggleClass("ng-hide");

				},

				directive = {
					restrict: "E",
					link: link
				};

			return directive;
		}])

	;
})(angular);
