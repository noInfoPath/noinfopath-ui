//file-viewer.js
(function (angular, undefined) {
	"use strict";

	function NoThumbnailViewerDirective($compile, $state, noFormConfig) {
		function _link(scope, el, attrs) {
			el.append("wassup");
			// TODO ATTRS WE NEED: showAsImage, fileId

		}

		function _compile(el, attrs) {
			ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity);

			return _link;
		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		.directive("noThumbnailViewer", ["$compile", "$state", "noFormConfig", NoThumbnailViewerDirective])
	;
})(angular);
