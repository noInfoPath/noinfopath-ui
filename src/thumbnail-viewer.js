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

    var _idList, backupData, droppedId, scopeVal, ctx, grid, formControlName, isDirty = false, renderFn;


    /*
     *
     * ## noThumbnailViewerService
     *
     * ### Dependecies
     * + $compile
     * + $state
     * + noFormConfig
     * + PubSub
     * + noNavigationManager
     * + noTransactionCache
     * + noLoginService
     * + $rootScope
     * + $q
     *
     * ### What is this for?
     * This service provides an API for outside NoInfoPath libraries (like noActionQueue) to interact with the `noThumbnailViewerDirective`. In also
     * provides the methods neccesary that are called as hooks in the `no-dnd` (The code behind the drag and drop).
     * The functions that are used by the drag and drop are as follows:
     *
     *  | Method Name | Description                                                                                                                                                                                                        |
     *  |-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
     *  | dragstart   | When the element is started to be dragged, this code pulls the `file-id` off of the attribute of the element. This `file-id` is considered the `dataTransfer`, if you know anything about HTML5 drag and drop.     |
     *  | dragover    | All this function does is true. If a `drag` event should be disabled for any reason, additional code can be added here and return false.                                                                           |
     *  | drop        | The drop is the complicated piece of code. When an element is dropped, this basically removes the element and places it in the correct position. Then, the `_idList` is updated, and the `navbar` state is changed |
     *  | click       | This event is triggered whenever an draggable element is clicked.                                                                                                                                                  |
     *
     * The other methods included are pretty self explanatory. The `cancel` method reverts the navbar to original state and undoes any changes. The `changeToDirtyNavbar` and
     * `changeToNormalNavbar` methods do what they say, and are called in the Directive and in this service. They use the `PubSub` mechanism to achieve this, in a way that
     * fakes the way that it is normally done by actual validation.
     *
     * The `save` method uses noTransactionCache to save to the `json` that tells it what dbName and dbTable to write to. See example config below.
     *
     *
     *
     * There is an internal array that takes care of the data called `_idList`. More about this to follow. The flow of the drag and drop can basically be summed
     * up to be as follows.
     *
     * 1. User *DRAGS* a Thumbnail.
     * 2. `dragstart` method fired
     * 3. The thumbnail that is being dragged gets the `.dndDraggingSource` source class, which hides it to simulate that the user is picking it up and moving it.
     * 3. `no-dnd-lists` code creates a placeholder element, and auto positions it based on mouse pointer.
     * 4. User *DROPS* a Thumbnail.
     * 5. `drop` method fired, and passes the location of where it is dropped relative to the other elements.
     * 5. The inner `_idList` is updated to reflect the new location.
     * 6. The `OrderBy` field is updated on each element to be the correct one.
     * 6. Thumbnail that is being moved is removed from the DOM, and placed where it needs to go.
     * 7. If the viewer is not already dirty, then it will change the navbar to the dirty navbar.
     *
     */
    function NoThumbnailViewerService($compile, $state, noFormConfig, PubSub, noNavigationManager, noTransactionCache, noLoginService, $rootScope, $q) {

        var SELF = this;

        this.dragstart = function(event, scope, element, droppedInfo, datasource) {
            var fileid = element.children().attr("file-id");
            console.log("we dragging");
            return fileid;
        };

        this.dragover = function(event, scope, droppedInfo, options) {
            return true;
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

        this.click = function(event, scope, element) {
            // IF WANT TO BE ABLE TO SELECT ITEMS FOR SOME REASON USE THIS
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



    /*
     *
     * ## noThumbnailViewerDirective
     *
     * ### Dependecies
     * + A `no-kendo-grid` as a sibling element
     *
     * ### Example
     * ```html
     * <no-kendo-grid no-form="noForm.noComponents.photos"></no-kendo-grid>
     * <no-thumbnail-viewer dnd-list draggable-thumbnails="true" no-form="noForm.noComponents.photos"></no-thumbnail-viewer>
     * ```
     * The `no-form` property should point to the same hive that is pointed to by the `no-kendo-grid`. If you wish to have drag-and-drop capabilites,
     * first make sure you have the `noDndList` module, and that you include the `dnd-list` and `draggable-thumbnails='true'` attributes.
     *
     *
     * This hive should be inside the same hive within the grid.
     * ```js
     *  "noThumbnailViewer": {
     *      "saveDataOnScopeAs": "reportPhotoOrderInfo",
     *      "dbName": "rmEFR2",
     *      "dbTable": "Documents"
     *  },
     * ```
     *
     *
     */
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
            "noLoginService", "$rootScope", "$q", NoThumbnailViewerService
        ]);
})(angular);
