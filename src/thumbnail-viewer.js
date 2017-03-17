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

	var _idList, droppedId, scopeVal;

    function ThumbnailDragAndDropService($compile, $state, noFormConfig) {

        function NoThumbnailClass() {

        }

        this.getThumbnailConstructor = function() {
            return NoThumbnailClass;
        };

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
            droppedId = currentFileID;

            var index,
                noThumbnailViewer = angular.element(event.currentTarget),
                children = noThumbnailViewer.find(".no-thumbnail");

            for(var i=0; i<_idList.length; i++) {
                if(_idList[i].FileID === currentFileID) {
                    index = i;
                    break;
                }
            }
            var photoThatWillBeReplaced = _idList.splice(index, 1)[0];
            var spliceIndex = (location>index) ? (location-1) : location;
            _idList.splice( spliceIndex, 0, photoThatWillBeReplaced);

            for(var j=0; j<_idList.length; j++) {
                scope.fileIdOrderMap[_idList[j].FileID] = j;
                _idList[j].OrderBy = j;
            }

            var childToMove = noThumbnailViewer.find(".no-thumbnail.dndDraggingSource");
            var thumbnailNdx = location+2;

            if(thumbnailNdx > _idList.length+1) {
                childToMove.insertAfter(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx-2) + ")"));
            }

            childToMove.insertBefore(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx) + ")"));
            scope[scopeVal] = _idList;

        };

        this.dragleave = function(event, scope) {
        };

        this.click = function(event, scope, element) {

        };
    }

    function NoThumbnailViewerDirective($compile, $state, noFormConfig) {

        // TOO SPECIFIC TO RM RIGHT NOW!

		function _render(ctx, scope, el, attrs) {
            var children = el.find(".no-thumbnail");
            var noFileViewersHtml = _createFileViewers(_idList.map(function(blob, index) {
                blob.OrderBy = blob.OrderBy || index;
                var fid = blob.FileID;
                scope.fileIdOrderMap[fid] = blob.OrderBy;
                return blob.FileID;
            }));
            el.html($compile(noFileViewersHtml)(scope));
		}

        function _createFileViewers(fileIds) {
            var html = "";
            for (var i = 0; i < fileIds.length; i++) {
                // lol
                html += "<div class=\"no-thumbnail\" dnd-draggable file-id=\"" + fileIds[i] + "\">";
                    html += "<no-file-viewer type=\"image\" show-as-image=\"yes\" file-id=\"" + fileIds[i] + "\">";
                    html += '</no-file-viewer>';
                    html += '<input class="form-control" ng-model=\"' + scopeVal + '[fileIdOrderMap[\'' + fileIds[i] + '\']].Description\" placeholder="Description">';
                html += "</div>";
            }
            return html;
        }


        function _link(ctx, scope, el, attrs) {
            scope.fileIdOrderMap = {};

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

				// scope.$watch("dragNdropConfig.dropped", function(n, o, s) {
                //     if(n !== o) {
                //         _render(ctx, scope, el, attrs);
                //     }
				// });
            }

            var pg = ctx.component.noGrid.referenceOnParentScopeAs,
                grid = el.parent().find("grid").data("kendoGrid");

            grid.bind("dataBound", function() {
                var d = grid.dataSource.data();
                if(d && !!d.length) {
                    _idList = d.toJSON();
                    scope[scopeVal] = _idList;
                    _render(ctx, scope, el, attrs);
                }

            });

            // scope.$watch(pg + "._data", function(n, o, s) {
            //     if (n) {
            //         if (n && !!n.length) {
            //             console.log("WE OUT HERE WAYCHING SCOPES KANKINGLY");
            //             _idList = n.map(function(blob) {
            //                 return blob.FileID;
            //             });
            //
			// 			_render(ctx, scope, el, attrs);
            //         }
            //     }
            //
            // });

            el.append("No Photos!");

        }

        function _compile(el, attrs) {
            var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, {}, attrs.noForm);
            scopeVal = ctx.component.noThumbnailViewer.saveDataOnScopeAs;
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
