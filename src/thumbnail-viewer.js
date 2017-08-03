/*
 *	[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 *
 *	___
 *
 *	[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.56 *
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

	var _idList, backupData, droppedId, scopeVal, ctx, formControlName, isDirty = false,
		renderFn;


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

		function _dragstart (ctx, event, scope, element, droppedInfo, datasource) {
			var fileid = element.attr("file-id");
			console.log("we dragging");
			return fileid;
		}

		function _dragover(ctx, event, scope, droppedInfo, options) {
			return true;
		}

		function _drop(ctx, event, scope, currentFileID, location, droppedInfo) {
			console.log("NoThumbnailViewerService::drop()", location, currentFileID);

			var state = scope[ctx.componentType],
				widget = ctx.widget,
				index,
				noThumbnailViewer = state.element,
				children = noThumbnailViewer.find(".no-thumbnail"),
				photoThatWillBeReplaced, spliceIndex, childToMove, thumbnailNdx;

			for (var i = 0; i < state.data.sorted.length; i++) {
				if (state.data.sorted[i][widget.fileIdField] === currentFileID) {
					index = i;
					break;
				}
			}

			photoThatWillBeReplaced = state.data.sorted.splice(index, 1)[0];
			spliceIndex = (location > index) ? (location - 1) : location;

			state.data.sorted.splice(spliceIndex, 0, photoThatWillBeReplaced);

			for (var j = 0; j < state.data.sorted.length; j++) {
				state.data.sorted[j][widget.orderByField] = j;
			}

			childToMove = noThumbnailViewer.find(".no-thumbnail.dndDraggingSource");

			thumbnailNdx = location + 2;

			if (thumbnailNdx > state.data.sorted.length + 1) {
				childToMove.insertAfter(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx - 2) + ")"));
			}

			childToMove.insertBefore(angular.element(".no-thumbnail:nth-child(" + (thumbnailNdx) + ")"));

			//scope[scopeVal] = _idList;


			if (!state.isDirty) {
				SELF.changeToDirtyNavbar();
			}

		}

		function _cancel(ctx, scope, renderFn) {
			var state = scope[ctx.componentType];

			state.data.sorted = state.data.pristine;
			state.grid.dataSource.read(0);
			SELF.changeToNormalNavbar();
			renderFn();
		}

		function _save(ctx, scope) {
			var state = scope[ctx.componentType],
				widget = ctx.widget,
				noTransactionConfig = {
					noDataSource: {
						dataProvider: "noIndexedDB",
						databaseName: widget.dbName,
						entityName: widget.dbTable,
						primaryKey: "ID",
						noTransaction: {
							update: true
						}
					}
				},
				promises = [],
				noTrans = noTransactionCache.beginTransaction(noLoginService.user.userId, noTransactionConfig, scope);

			for (var i = 0; i < state.data.sorted.length; i++) {
				promises.push(scope["noIndexedDb_" + widget.dbName][widget.dbTable].noUpdate(state.data.sorted[i], noTrans));
			}

			return $q.all(promises)
				.then(function (resp) {
					noTransactionCache.endTransaction(noTrans);
					state.data.pristine = state.data.sorted;
					state.grid.dataSource.read(0);
					SELF.changeToNormalNavbar();
				})
				.catch(function (err) {
					console.error(err);
					return err;
				});


		}

		function _click(ctx, event, scope, element) {
			// IF WANT TO BE ABLE TO SELECT ITEMS FOR SOME REASON USE THIS
		}

		function _changeToDirtyNavbar(ctx, scope) {
			var state = scope[ctx.componentType],
				widget = ctx.widget;

			noNavigationManager.changeNavBar({}, {}, {}, widget.noNavigation.componentName, widget.noNavigation.barid + ".dirty");

			state.isDirty = true;

			PubSub.publish("no-validation::dirty-state-changed", state);
		}

		function _changeToNormalNavbar(ctx, scope) {
			var state = scope[ctx.componentType],
				widget = ctx.widget;

			noNavigationManager.changeNavBar({}, {}, {}, widget.noNavigation.componentName, widget.noNavigation.barid);

			state.isDirty = false;

			PubSub.publish("no-validation::dirty-state-changed", state);
		}

		this.configure = function(ctx, scope, renderFn) {
			this.dragstart = _dragstart.bind(this, ctx);
			this.dragover = _dragover.bind(this, ctx);
			this.drop = _drop.bind(this, ctx);
			this.cancel = _cancel.bind(this, ctx, scope, renderFn);
			this.save = _save.bind(this, ctx, scope);
			this.click = _click.bind(this, ctx);
			this.changeToNormalNavbar = _changeToNormalNavbar.bind(this, ctx, scope);
			this.changeToDirtyNavbar = _changeToDirtyNavbar.bind(this, ctx, scope);
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
	 *
	 *
	 */
	function NoThumbnailViewerDirective($compile, $state, noFormConfig, noThumbnailViewerService, PubSub, $timeout) {

		// TOO SPECIFIC TO RM RIGHT NOW!
		var cnt = 0;
		function _render(ctx, scope, el) {
			cnt--;

			var state = scope[ctx.componentType],
				widget = ctx.widget,
				children = el.find(".no-thumbnail"), //???
				noFileViewersHtml;

				state.hash = {};

				console.log("state.data.sorted", !!state.data.sorted.length);
				noFileViewersHtml = _createFileViewers(state.data.sorted.map(function (fileObj, index) {
					var fid = fileObj[widget.fileIdField];

					fileObj.OrderBy = angular.isNumber(fileObj[widget.orderByField]) ? fileObj[widget.orderByField] : index;

					state.hash[fid] = fileObj;

					//scope[formControlName][fid] = blob; ??

					return fileObj;

				}), formControlName);

			el.html($compile(noFileViewersHtml)(scope));

			// Deal with the annoying stretching we need position: static, but we need position: absolute if there
			// are a lot of thumbnails to prevent smooshing and overflow
			state.element.toggleClass("lots-of-pictures", state.data.sorted.length > 6);

			el.find("input[type=\"text\"]").change(function (ctx, scope, e) {
				var THAT = e.currentTarget,
					state = scope[ctx.componentType],
					widget = ctx.widget,
					fileId = THAT.parentElement.attributes['file-id'].value;

				if (!state.isDirty) {
					noThumbnailViewerService.changeToDirtyNavbar(ctx, scope);
				}

				for(var i=0; i < state.data.sorted.length; i++) {
					var fileObj = state.data.sorted[i];

					if(fileObj[widget.fileIdField] === fileId) {
						fileObj[widget.descriptionField] = THAT.value;
						break;
					}
				}
			}.bind(null, ctx, scope));

			el.find("input[type=\"checkbox\"]").change(function() {
				var fileId = this.parentElement.parentElement.attributes['file-id'].value;
				angular.element("grid input[value=\"" + fileId + "\"]").prop("checked", this.checked);
				var grid = state.grid.element,
					allCheckBoxes = grid.find('tbody input:checkbox:checked');

				PubSub.publish("noGrid::rowsChecked", {grid: grid, allCheckBoxes: allCheckBoxes});
			});

		}

		function _createFileViewers(fileIds, formControlName) {
			var html = "", widget = ctx.component.noThumbnailViewer;
			for (var i = 0; i < fileIds.length; i++) {
				var fileId = fileIds[i][widget.fileIdField];
				// lol
				html += "<div class=\"no-thumbnail\" dnd-draggable file-id=\"" + fileId + "\">";
					html += "<div class=\"toolbar\">";
						html += "<input\ tabindex=\"-1\" type=\"checkbox\">";
						html += "<button type=\"button\" class=\"btn btn-clear btn-xs\" tabindex=\"-1\" ui-sref=\"efr.report.document({id:'"+ fileId+ "'})\"><span class=\"glyphicon glyphicon-zoom-in\"></span></button>";
					html += "</div>";
					html += "<no-file-viewer height=\"" + (widget.height || "50%") + "\" width=\"" + (widget.width || "50%") + "\" show-as-image=\"yes\" file-id=\"" + fileId + "\" type=\"" + fileIds[i][widget.typeField]  + "\">";
					html += "</no-file-viewer>";
					html += "<input type=\"text\" class=\"form-control\" ng-model=\"noThumbnailViewer.hash['" + fileId + "']." + widget.descriptionField +  "\" placeholder=\"" + (!!fileIds[i][widget.descriptionField] ?  fileIds[i][widget.descriptionField] : fileIds[i].name) + "\">";
				html += "</div>";
			}
			return html;
		}


		function _prerender(ctx, scope) {
			var state = scope[ctx.componentType],
				widget = ctx.widget;

			state.data.unsorted = state.grid.dataSource.data().toJSON();


			//if(!state.data.pristine)
			state.data.pristine = state.data.unsorted;

			console.log("state.data.unsorted", !!state.data.unsorted.length);

			if (state.data.unsorted && !!state.data.unsorted.length) {
				var sorted = state.data.unsorted.sort(function (a, b) {
					return a[widget.orderByField] - b[widget.orderByField];
				});

				// We do not want to cause a rerender if what is already rendered is fine
                if(state.data.sorted[0] && state.data.sorted.length === sorted.length && sorted[0][widget.fileIdField] === state.data.sorted[0][widget.fileIdField])
					return;


				state.data.sorted = sorted;

				if (state.data.sorted[0] && (state.data.unsorted[0][widget.fileIdField] === state.data.sorted[0][widget.fileIdField])) {
					_render(ctx, scope, state.element);
				} else {
					state.data.sorted = state.data.unsorted;
					_render(ctx, scope, state.element);
				}



				//scope[scopeVal] = sorted;
			} else {
				state.data.sorted = [];
				state.element.html("No Photos!");
			}
		}

		function _link(ctx, scope, el, attrs) {
			var state = {
					grid: el.scope()[ctx.component.noGrid.referenceOnParentScopeAs],
					formControlName: attrs.ngForm || "photoThumbnailForm",
					isDirty: false,
					data: {
						sorted: [],
						unsorted: [],
						pristine: null
					},
					hash: {},
					element: el
				};

			noThumbnailViewerService.configure(ctx, scope, _render.bind(null, ctx, scope, el));

			scope[ctx.componentType] = state;

			//scope[formControlName] = scope[formControlName] || {};

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

			state.grid.bind("dataBound", _prerender.bind(null, ctx, scope));


			var pubSubID = PubSub.subscribe("noTabs::change", function (ctx, scope, tabInfo) {
				var state = scope[ctx.componentType];

				// state.data.sorted = [];
			}.bind(null, ctx, scope));


			el.append("No Photos!");

			el.on("$destroy", function () {
				// ALWAYS CLEAN UP YOUR BINDINGS AND SUBSCRIPTIONS
				state.grid.unbind("dataBound");
				if(pubSubID) PubSub.unsubscribe(pubSubID);
			});

		}

		function _compile(el, attrs) {
			ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noThumbnailViewer", attrs.noForm);


			//scopeVal = ctx.component.noThumbnailViewer.saveDataOnScopeAs;
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
