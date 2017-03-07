/*
 *	[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 *
 *	___
 *
 *	[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.25 *
 *
 * [![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)
 *
 *	Copyright (c) 2017 The NoInfoPath Group, LLC.
 *
 *	Licensed under the MIT License. (MIT)
 *
 *	___
 *
 * noThumbnailViewer Directive
 * ------------------------
 *
*/

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
