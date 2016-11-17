//resize.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noResize", [function() {
		var link = function(scope, el, attr) {

				var resize = Number(attr.noResize ? attr.noResize : 90);

				el.css("height", (window.innerHeight - resize) + "px");
				//console.log("height: ", el.height());

				scope.onResizeFunction = function() {
					scope.windowHeight = window.innerHeight;
					scope.windowWidth = window.innerWidth;

					//console.log(scope.windowHeight+"-"+scope.windowWidth)
				};

				// Call to the function when the page is first loaded
				scope.onResizeFunction();

				angular.element(window).bind('resize', function() {
					scope.onResizeFunction();
					scope.$apply();
				});
			},
			dir = {
				restrict: "A",
				link: link
			};

		return dir;
	}])

	;
})(angular);