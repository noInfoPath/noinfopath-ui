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

    var _idList, backupData, droppedId, scopeVal, ctx, grid, formControlName, isDirty = false;

    var renderFn;

    function ThumbnailDragAndDropService($compile, $state, noFormConfig, PubSub, noNavigationManager, noTransactionCache, noLoginService, $rootScope, $q) {

        var SELF = this;

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

            for (var i = 0; i < _idList.length; i++) {
                if (_idList[i].FileID === currentFileID) {
                    index = i;
                    break;
                }
            }
            var photoThatWillBeReplaced = _idList.splice(index, 1)[0];
            var spliceIndex = (location > index) ? (location - 1) : location;
            _idList.splice(spliceIndex, 0, photoThatWillBeReplaced);

            for (var j = 0; j < _idList.length; j++) {
                _idList[j].OrderBy = j;
            }

            var childToMove = noThumbnailViewer.find(".no-thumbnail.dndDraggingSource");
            var thumbnailNdx = location + 2;

            if (thumbnailNdx > _idList.length + 1) {
                childToMove.insertAfter(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx - 2) + ")"));
            }

            childToMove.insertBefore(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx) + ")"));
            scope[scopeVal] = _idList;


            if (!isDirty) {
                isDirty = true;
                SELF.changeToDirtyNavbar();

            }

        };

        this.cancel = function() {
            SELF.changeToNormalNavbar();
            renderFn();
        };

        this.save = function() {
            var dbName = ctx.component.noThumbnailViewer.dbName;
            var entityName = ctx.component.noThumbnailViewer.dbTable;
            var noTransactionConfig = {
                    noDataSource: {
                        dataProvider: "noIndexedDB",
                        databaseName: dbName,
                        entityName: entityName,
                        primaryKey: "ID",
                        noTransaction: {
                            update: true
                        }
                    }
                },
                promises = [],
                noTrans = noTransactionCache.beginTransaction(noLoginService.user.userId, noTransactionConfig, $rootScope);

            for (var i = 0; i < _idList.length; i++) {
                var update = $rootScope["noIndexedDb_" + dbName][entityName].noUpdate(_idList[i], noTrans);
                promises.push(update);
            }

            return $q.all(promises)
                .then(function(resp) {
                    noTransactionCache.endTransaction(noTrans);
                    SELF.changeToNormalNavbar();
                })
                .catch(function(err) {
                    console.error(err);
                });


        };

        this.dragleave = function(event, scope) {};

        this.click = function(event, scope, element) {

        };

        this.changeToDirtyNavbar = function() {
            noNavigationManager.changeNavBar({}, {}, {}, "mainNavBar", "photos.dirty");
            PubSub.publish("no-validation::dirty-state-changed", {
                isDirty: true,
            });
        };

        this.changeToNormalNavbar = function() {
            isDirty = false;
            noNavigationManager.changeNavBar({}, {}, "", "mainNavBar", "photos");
            PubSub.publish("no-validation::dirty-state-changed", "photos");
        };
    }


    function NoThumbnailViewerDirective($compile, $state, noFormConfig, noThumbnailViewerService, PubSub, $timeout) {

        // TOO SPECIFIC TO RM RIGHT NOW!

        function _render(ctx, scope, el, attrs, ctrls) {
            var children = el.find(".no-thumbnail");
            var noFileViewersHtml = _createFileViewers(_idList.map(function(blob, index) {
                blob.OrderBy = angular.isNumber(blob.OrderBy) ? blob.OrderBy : index;
                var fid = blob.FileID;
                scope[formControlName][fid] = blob.Description;
                return blob.FileID;
            }), formControlName);
            el.html($compile(noFileViewersHtml)(scope));

            el.find("input").change(function() {
                if (!isDirty) {
                    isDirty = true;
                    noThumbnailViewerService.changeToDirtyNavbar();
                }
                var fileId = this.parentElement.attributes['file-id'].value;
                for (var j = 0; j < _idList.length; j++) {
                    if (_idList[j].FileID === fileId) {
                        _idList[j].Description = this.value;
                        break;
                    }
                }
            });

        }

        function _createFileViewers(fileIds, formControlName) {
            var html = "";
            for (var i = 0; i < fileIds.length; i++) {
                // lol
                html += "<div class=\"no-thumbnail\" dnd-draggable file-id=\"" + fileIds[i] + "\">";
                html += "<no-file-viewer type=\"image\" show-as-image=\"yes\" file-id=\"" + fileIds[i] + "\">";
                html += '</no-file-viewer>';
                // html += '<input class="form-control" name=\"'+ fileIds[i] + '\" ng-model=\"' + scopeVal + '[fileIdOrderMap[\'' + fileIds[i] + '\']].Description\" placeholder="Description">';
                html += '<input class="form-control" ng-model=\"' + formControlName + "[\'" + fileIds[i] + '\']\" placeholder="Description">';
                html += "</div>";
            }
            return html;
        }


        function _link(ctx, scope, el, attrs) {

            formControlName = attrs.ngForm || "photoThumbnailForm";
            scope[formControlName] = scope[formControlName] || {};

            if (!!attrs.draggableThumbnails) {
                scope.dragNdropConfig = {
                    "provider": "noThumbnailViewerService",
                    "palette": {
                        "dataSource": {
                            "provider": "noConfig",
                            "method": "noPalette"
                        }
                    }
                };

            }

            grid = el.parent().parent().find("grid").data("kendoGrid");

            function _prerender() {
                var d = grid.dataSource.data();
                if (d && !!d.length) {
                    d = d.toJSON().sort(function(a, b) {
                        return a.OrderBy - b.OrderBy;
                    });

                    if (_idList[0] && (d[0].FileID === _idList[0].FileID)) return;

                    _idList = d;
                    isDirty = false;
                    _render(ctx, scope, el, attrs);
                    scope[scopeVal] = _idList;
                } else {
                    el.html("No Photos!");
                }
            }


            renderFn = _prerender;

            grid.bind("dataBound", _prerender);


            var pubSubID = PubSub.subscribe("noTabs::change", function(tabInfo) {
                _idList = [];
            });


            el.append("No Photos!");

            el.on("$destroy", function() {
                // ALWAYS CLEAN UP YOUR BINDINGS AND SUBSCRIPTIONS
                grid.unbind("dataBound");
                PubSub.unsubscribe(pubSubID);
            });

        }

        function _compile(el, attrs) {
            ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, {}, attrs.noForm);
            scopeVal = ctx.component.noThumbnailViewer.saveDataOnScopeAs;
            return _link.bind(null, ctx);
        }

        return {
            restrict: "E",
            compile: _compile
        };
    }

    angular.module("noinfopath.ui")
        .directive("noThumbnailViewer", ["$compile", "$state", "noFormConfig", "noThumbnailViewerService", "PubSub", "$timeout", NoThumbnailViewerDirective])
        .service("noThumbnailViewerService", ["$compile", "$state", "noFormConfig", "PubSub", "noNavigationManager", "noTransactionCache",
            "noLoginService", "$rootScope", "$q", ThumbnailDragAndDropService
        ]);
})(angular);
