//progressbar.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")
		.directive("noProgressbar", ['$timeout', 'lodash', function($timeout, _) {

			var link = function(scope, el, attr, ctrl) {

					function update() {
						var p = angular.element(el.children()[0]),
							m = angular.element(el.children()[1]);

						p.removeAttr("class");
						p.addClass("progress-bar " + this.css);
						p.css("width", this.percent + "%");
						p.attr("aria-valuenow", this.percent);
						m.text(this.message);
					}


					el.addClass("progress");
					el.append('<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/><div class="no-progress-message"></div>');

					//Watching for changes to this progress bar instance.
					scope.$watchCollection(attr.noProgressbar, function(newData, oldData, scope) {
						if (newData) {
							$timeout(function() {
								var r = scope.$root || scope;
								r.$apply(update.bind(this));
							}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
						}
					}.bind(attr));

					//TODO: Remove this code after E2E testing.
					// scope.$watch(attr.noProgressbar + ".message", function(newData, oldData, scope) {
					// 	if (newData) {
					// 		$timeout(function() {
					// 		   var r = scope.$root || scope;
					// 			r.$apply(update.bind(this));
					// 		}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
					// 	}
					// }.bind(attr));
					//
					// scope.$watch(attr.noProgressbar + ".css", function(newData, oldData, scope) {
					// 	if (newData) {
					// 		$timeout(function() {
					// 			var r = scope.$root || scope;
					// 			r.$apply(update.bind(this));
					// 		}.bind(noInfoPath.getItem(scope, attr.noProgressbar)));
					// 	}
					// }.bind(attr));
				},
				controller = ['$scope', '$element', function($scope, $element) {
					// var noProgressbar = $element.attr("no-progressbar")
					//
					// $scope[noProgressbar] = new progressTracker();
			}],
				directive = {
					restrict: "A",
					controller: controller,
					link: link
				};

			return directive;
        }]);
})(angular);
