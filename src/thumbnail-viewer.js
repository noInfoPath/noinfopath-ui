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
(function(angular, undefined) {
    "use strict";

	var _idList;

    function ThumbnailDragAndDropService($compile, $state, noFormConfig) {

        this.dragstart = function(event, scope, element, droppedInfo, datasource) {
            var fileid = element.children().attr("file-id");
			console.log("we dragging");
            return fileid;
        };

        this.dragover = function(event, scope, droppedInfo, options) {
            return true;
        };

		this.getLocation = function(element, placeHolder) {
			console.log("getting location");
		};

        this.drop = function(event, scope, currentFileID, location, droppedInfo) {
			console.log(location);
            var index = _idList.indexOf(currentFileID);

            _idList.splice(index, 1);

            _idList.splice(location, 0, currentFileID);

            scope.dragNdropConfig.dropped = Date.now();
        };

        this.dragleave = function(event, scope) {
        };

        this.click = function(event, scope, element) {

        };
    }

    function NoThumbnailViewerDirective($compile, $state, noFormConfig) {

        // TOO SPECIFIC TO RM RIGHT NOW!

		function _render(ctx, scope, el, attrs) {
			var noFileViewersHtml = _createFileViewers(_idList);
			el.html($compile(noFileViewersHtml)(scope));
		}

        function _createFileViewers(fileIds) {
            var html = "";
            for (var i = 0; i < fileIds.length; i++) {
                // lol
                html += "<div class=\"no-thumbnail\" dnd-draggable>";
                    html += "<no-file-viewer type=\"image\" show-as-image=\"yes\" file-id=\"" + fileIds[i] + "\">";
                    html += '</no-file-viewer>';
                    html += '<input class="form-control" placeholder="Description">';
                html += "</div>";
            }
			_idList = fileIds;
            return html;
        }


        function _link(ctx, scope, el, attrs) {

            var pg = ctx.component.noGrid.referenceOnParentScopeAs;

            if (!!attrs.draggableThumbnails) {
                scope.dragNdropConfig = {
                    "provider": "thumbnailDragAndDrop",
                    "palette": {
                        "dataSource": {
                            "provider": "noConfig",
                            "method": "noPalette"
                        }
                    },
					"dropped": Date.now()
                };

				scope.$watch("dragNdropConfig.dropped", function(n, o, s) {
                    if(n !== o) {
                        _render(ctx, scope, el, attrs);
                    }
				});
            }

            scope.$watch(pg + "._data", function(n, o, s) {
                if (n) {
                    if (n && !!n.length) {
                        _idList = n.map(function(blob) {
                            return blob.FileID;
                        });

						_render(ctx, scope, el, attrs);
                    }
                }

            });

            el.append("wassup");
            // TODO ATTRS WE NEED: showAsImage, fileId

        }

        function _compile(el, attrs) {
            var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, {}, attrs.noForm);

			if(!!attrs.draggableThumbnails) {
			//	el.attr("dnd-list", "");
			}

            return _link.bind(null, ctx);
        }

        return {
            restrict: "E",
            compile: _compile
        };
    }

    angular.module("noinfopath.ui")
        .directive("noThumbnailViewer", ["$compile", "$state", "noFormConfig", NoThumbnailViewerDirective])
        .service("thumbnailDragAndDrop", ["$compile", "$state", "noFormConfig", ThumbnailDragAndDropService]);
})(angular);
