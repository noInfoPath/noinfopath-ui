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

		function _createFileViewers(fileIds) {
			var html = "";
			for(var i=0; i<fileIds.length; i++) {
				html += "<no-file-viewer type=\"image\" show-as-image=\"yes\" file-id=\"" + fileIds[i] + "\"></no-file-viewer>";
			}
			return html;
		}

		function _link(ctx, scope, el, attrs) {

			var pg = ctx.component.noGrid.referenceOnParentScopeAs;

			scope.$watch(pg+"._data", function(n, o, s) {
				if(n) {
					if(n && !!n.length) {
						var fileIds = n.map(function(blob) {
							return blob.FileID;
						}),
						noFileViewersHtml = _createFileViewers(fileIds);

						el.html($compile(noFileViewersHtml)(scope));
					}
				}

			});

			el.append("wassup");
			// TODO ATTRS WE NEED: showAsImage, fileId

		}

		function _compile(el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, {}, attrs.noForm);

			return _link.bind(null, ctx);
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
