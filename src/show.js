//show.js
(function(angular, undefined){
	"use strict";

	function NoShowDirective(noSecurity){

		function _compile(el, attrs){
			var perm;
			if(attrs.noSecurity){
				perm = noSecurity.getPermissions(attrs.noSecurity);

				if(attrs.grant === "W"){
					if(perm && perm.canWrite){
						el.attr("ng-show", attrs.noShow);
					} else {
						el.addClass("ng-hide");
					}
				} else {
					if(perm && perm.canRead){
						el.attr("ng-show", attrs.noShow);
					} else {
						el.addClass("ng-hide");
					}
				}

			} else {
				el.attr("ng-show", attrs.noShow);
			}
		}

		function _link(scope, el, attrs){

		}

		return {
			restrict: "A",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		.directive("noShow", ["noSecurity", NoShowDirective]);

})(angular);
