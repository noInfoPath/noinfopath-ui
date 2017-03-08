/*
	*	[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
	*
	*	NoInfoPath UI (noinfopath-ui)
	*	=============================================
	*
	*	*@version 2.0.42* [![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)
	*
	*	Copyright (c) 2017 The NoInfoPath Group, LLC.
	*
	*	Licensed under the MIT License. (MIT)
	*	___
*/

//globals.js
(function(angular, undefined) {
	noInfoPath.ui = {};

	angular.module("noinfopath.ui", [
		'ngLodash',
		'noinfopath.helpers',
		'noinfopath.data'
	])

	.run(["$injector", function($injector) {
		var noInfoPath = {
			watchFiltersOnScope: function(attrs, dsConfig, ds, scope, $state, operation) {
				function _watch(newval, oldval, scope) {
					console.log("watch", newval, oldval);

					if (newval && newval !== oldval) {
						var provider = $injector.get(dsConfig.provider),
							table = provider[dsConfig.tableName],
							filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
							options = new window.noInfoPath.noDataReadRequest(table, {
								data: {
									filter: {
										"filters": filters
									},
									"sort": ds.sort
								}
							});

						ds.transport[operation || "read"](options)
							.then(function(data) {
								scope[attrs.noDataSource] = data;
							})
							.catch(function(err) {
								console.error(err);
							});
					}
				}

				if (dsConfig.filter) {
					//watch each dynamic filter's property if it is on the scope
					angular.forEach(dsConfig.filter, function(fltr) {
						if (angular.isObject(fltr.value) && fltr.value.source === "scope") {
							scope.$watch(fltr.value.property, _watch);
						}
					});

					//filters = window.noInfoPath.bindFilters(dsConfig.filter, scope, $state.params),
				}
			}
		};

	}])


	;
})(angular);

//progressbar.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")
		.directive("noProgressbar", ['$timeout', 'lodash', function($timeout, _) {

			var link = function(scope, el, attr, ctrl) {
					el.css("poistion", "relative")
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
					el.html('<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/><div class="no-progress-message text-center" style="position: absolute; top: 0; left:0; bottom: 0; right: 0; z-index: 100"></div>');

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

//breadcrumb.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noBreadcrumb", ['$q', '$state', 'noConfig', '$injector', function($q, $state, noConfig, $injector) {
		function NoBreadcrumb($state, config) {

			var state = $state,
				_states = {},
				_index = [],
				_visible = [];

			//Update the current `this.current` list of breadcums to stop at
			//supplied `stateName`.
			this.update = function(toState) {
				var state = toState;
				_visible = [];

				for (var i in _index) {
					var item = _index[i];
					_visible.push(item);
					if (item === state.name) {
						break;
					}
				}
			};

			//Loads state configuration from a hash table supplied `states`
			this.load = function(states) {

				angular.extend(_states, states);
				_index = [];
				angular.forEach(_states, function(item, key) {
					_index.push(key);
					item.state = state.get(key);
				});
			};

			//Reset both the list `_states` and `_visible` states
			this.reset = function() {
				_states = {};
				_visible = {};
			};

			if (config) {
				this.load(config);
			}

			Object.defineProperties(this, {
				"current": {
					"get": function() {
						return _visible;
					}
				},
				"states": {
					"get": function() {
						return _states;
					}
				}
			});
		}

		var directive = {
			template: "<ol class=\"breadcrumb\"></ol>",
			link: function(scope, el, attrs) {
				var state = $state,
					q = $q,
					db = $injector.get(attrs.noProvider),
					scopeKey;

				function _start() {

					//scope is defaults to noBreadcrumb, however if the
					//directive's primary attribute has a value, that will be
					//used instead.
					scopeKey = attrs.noBreadcrumb || "noBreadcrumb";

					//`noConfig.current.settings` should have a property with a name
					//that matches `scopeKey`.
					config = noConfig.current.settings[scopeKey];
					scope.noBreadcrumb = new NoBreadcrumb($state, config);

					//whenever ui-router broadcasts the $stateChangeSuccess event
					//noBreadcrumb will refresh itself based on the current state's
					//properties.
					scope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams) {
						//console.log(toState, toParams, fromState, fromParams);
						return;

						// var c = config[toState.name];
						// if(!c) throw toState.name + " noBreadcrumb comfig was not found in config.json file.";
						// if(!c.title) throw "noBreadcrumb.title is a required property in config.json";
						//
						// //Is c.title and object or a string?
						// if(angular.isObject(c.title)){
						//     if(!c.title.dataSource) throw "noBreadcrumb.title.dataSource is a required property in config.json";
						//     if(!c.title.textField) throw "noBreadcrumb.title.textField is a required property in config.json";
						//     if(!c.title.valueField) throw "noBreadcrumb.title.valueField is a required property in config.json";
						//
						//     //When c.title is an object the breadcrumb title
						//     //is derrived from a database record.  Resolve the
						//     //record before updating the scope.noBreadcrumb
						//     //object.
						//     var _table = db[c.title.dataSource],
						//         _field = c.title.valueField,
						//         _value = toParams[c.title.valueField],
						//         req = new noInfoPath.noDataReadRequest(q, _table);
						//
						//     //Assume that all strings that can be converted to a number
						//     //should be converted to a number.
						//     var num = Number(_value);
						//     if(angular.isNumber(num)){
						//         _value = Number(num);
						//     }
						//
						//     //Configure and execute a noDataReadRequest object
						//     //against noIndexedDB::table.noCRUD::one extention method.
						//     req.addFilter(_field, "eq", _value);
						//     _table.noCRUD.one(req)
						//         .then(function(data){
						//             //When the title data is resolved save the data on the
						//             //toState's data property, then update the appropriate
						//             //scope item using the current toState.
						//             toState.data = data;
						//             scope[scopeKey].update(toState);
						//             _refresh();
						//         })
						//         .catch(function(err){
						//             console.error(err);
						//         });
						// }else{
						//     //If the title is not an object, assume it is a string and
						//     //just update the appropriate scope item using the current toState.
						//     scope[scopeKey].update(toState);
						//     _refresh();
						// }
					});
				}

				function _refresh() {
					var ol = el.find("ol");
					ol.empty();
					angular.forEach(scope.noBreadcrumb.current, function(item, i) {
						var state = this.states[item],
							title,
							url = state.urlTemplate,
							urlParam;

						//if data and ":" + valueField in url then replace ":" + valueField with data[valueField]
						// if(state.state.data && state.valueField && state.state.url.indexOf(":" + state.valueField) > -1){
						//     url = "#" + state.urlTemplate.replace(":" + state.valueField, state.state.data[state.valueField]);
						// }

						if (angular.isObject(state.title)) {
							url = url.replace(":" + state.title.valueField, state.state.data[state.title.valueField]);

							if (state.state.data) {
								title = state.state.data[state.title.textField];
							} else {
								title = state.state.name;
							}

						} else {
							title = state.title || state.state.name;
						}


						if (i === this.current.length - 1) {
							ol.append("<li>" + title + "</li>");
						} else {
							if (url) {
								ol.append("<li><a href=\"" + url + "\">" + title + "</a></li>");
							} else {
								ol.append("<li>" + title + "</li>");
							}
						}

					}, scope.noBreadcrumb);
				}

				// db.whenReady()
				//     .then(_start)
				//     .catch(function(err){
				//         console.error(err);
				//     });
			}
		};

		return directive;
	}]);


})(angular);

//resize.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noResize", [function() {
		var link = function(scope, el, attr) {
				el.css("height", (window.innerHeight - Number(attr.noResize ? attr.noResize : 90)) + "px");
				//console.log("height: ", el.height());

				scope.onResizeFunction = function() {
					scope.windowHeight = window.innerHeight;
					scope.windowWidth = window.innerWidth;

					//console.log(scope.windowHeight+"-"+scope.windowWidth)
				};

				// Call to the function when the page is first loaded
				scope.onResizeFunction();

				angular.element(window).bind('resize', function() {
					scope.onResizeFunction();
					scope.$apply();
				});
			},
			dir = {
				restrict: "A",
				link: link
			};

		return dir;
	}])

	;
})(angular);

//menu.js
(function(angular, undefined) {
	function MenuItem() {
		if (arguments.length == 1 && angular.isObject(arguments[0])) {
			this.title = arguments[0].title;
			this.state = arguments[0].state;
			this.glyph = arguments[0].glyph;
			this.children = [];
		} else if (arguments.length > 1) {
			this.title = arguments[0];
			this.state = arguments[1];
			this.children = arguments.length == 3 ? arguments[2] : [];
		} else {
			this.title = "";
			this.state = "";
			this.children = [];
		}
	}
	noInfoPath.ui.MenuItem = MenuItem;

	function _buildMenuItem(menuItem, el) {
		if (menuItem.title) {
			var li = angular.element("<li></li>"),
				a = angular.element("<a></a>");

			a.text(menuItem.title);
			li.append(a);
			el.append(li);

			if (menuItem.glyph) {
				a.append(menuItem.glyph);
			}

			if (menuItem.state) {
				a.attr("ui-sref", menuItem.state);

			} else {
				li.attr("dropdown", "");
				li.addClass("dropdown");
				a.attr("href", "#");
				a.attr("dropdown-toggle", "");
				a.addClass("dropdown-toggle");

				if (menuItem.children.length) {
					var ul = angular.element("<ul class=\"dropdown-menu\" role=\"menu\"></ul>");
					li.append(ul);
					angular.forEach(menuItem.children, function(childMenu) {
						_buildMenuItem(childMenu, ul);
					});
				}
			}
		} else {
			if (menuItem.children.length) {
				angular.forEach(menuItem.children, function(childMenu) {
					_buildMenuItem(childMenu, el);
				});
			}
		}
	}

	var $httpProviderRef, $stateProviderRef;

	angular.module("noinfopath.ui")
		.config(['$httpProvider', '$stateProvider', function($httpProvider, $stateProvider) {
			$httpProviderRef = $httpProvider;
			$stateProviderRef = $stateProvider;
	}])

	.provider("noArea", [function() {
		var _menuConfig = [];

		function NoArea($state, $rootScope, $q, noConfig, _, noMenuData) {

			function _noMenuRecurse(root, menu) {
				var m;
				if (root.noMenu) {
					menu.push(m = new MenuItem(root.noMenu));

					if (root.noMenu.state) {
						angular.noop();
					} else {
						angular.forEach(root.childAreas, function(area, name) {
							if (area.noMenu) {
								m.children.push(new MenuItem(area.noMenu));
								// if(area.childAreas && area.childAreas.length > 0){
								// 	_noMenuRecurse(area, menu);
								// }
							}
						});
					}

				} else {
					angular.forEach(root.childAreas, function(area) {
						_noMenuRecurse(area, menu);
					});
				}
			}

			function _routeRecurse(root) {
				if (root.route) {
					if (!root.route.data) {
						root.route.data = {
							entities: {}
						};
					}

					root.route.data.title = root.title;

					if (root.noComponents) {
						root.route.data.noComponents = root.noComponents;
					}

					if (root.noDataSources) {
						root.route.data.noDataSources = root.noDataSources;
					}

					// if(root.noDataSources){
					// 	root.route.onEnter = _resolveData.bind(null, root.noDataSources);
					// }

					$stateProviderRef.state(root.route);
				}

				if (root.childAreas) {
					angular.forEach(root.childAreas, function(area) {
						_routeRecurse(area);
					});
				}
			}

			function _resolveData(dataSources) {
				console.log("resolveData", dataSources);
			}

			function _start() {

				if (!_) throw "lodash is required.";
				if (!noConfig) throw "noConfig is required.";
				if (!$stateProviderRef) throw "$stateProviderRef is required.";
				if (!noMenuData) throw "noMenuData is required.";

				var noArea2 = noConfig.current.noArea2;
				_noMenuRecurse(noArea2, noMenuData);
				_routeRecurse(noArea2);
				$rootScope.noAreaReady = true;
			}

			this.whenReady = function() {
				return $q(function(resolve, reject) {
					if ($rootScope.noAreaReady) {
						resolve();
					} else {
						$rootScope.$watch("noAreaReady", function(newval) {
							if (newval) {
								resolve();
							}
						});

						_start();
					}
				});
			};

			Object.defineProperties(this, {
				"menuConfig": {
					"get": function() {
						return noMenuData;
					}
				}
			});
		}

		this.$get = ['$state', '$rootScope', '$q', 'noConfig', 'lodash', function($state, $rootScope, $q, noConfig, _) {
			return new NoArea($state, $rootScope, $q, noConfig, _, _menuConfig);
		}];
	}])

	.directive("noAreaMenu", ["noArea", "$compile", "lodash", function(noArea, $compile, _) {
		var directive = {
			restrict: "A",
			transclude: true,
			compile: function(el, attrs) {
				_buildMenuItem(new MenuItem("", "", noArea.menuConfig), el);

				return function(scope, el, attrs) {};
			}
		};

		return directive;
	}]);

})(angular);

//shared-datasource.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noSharedDatasource", ['$state', 'noConfig', 'noManifest', 'noKendo', 'noIndexedDB', function($state, noConfig, noManifest, noKendo, noIndexedDB) {
		return {
			restrict: "E",
			link: function(scope, el, attrs) {

				noConfig.whenReady()
					.then(_start)
					.catch(function(err) {
						console.error(err);
					});


				function _start() {
					var area = attrs.noArea,
						tableName = attrs.noDatasource,
						noTable = noManifest.current.indexedDB[tableName],
						config = noConfig.current[area][tableName];

					var ds = noKendo.makeKendoDataSource(tableName, noIndexedDB, {
						serverFiltering: true,
						serverPaging: true,
						serverSorting: true,
						pageSize: config.pageSize || 10,
						batch: false,
						schema: {
							model: config.model
						},
						filter: noKendo.makeKeyPathFiltersFromHashTable($state.params)
					});

					scope.$parent[tableName] = new kendo.data.DataSource(ds);
				}
			}
		};
	}])

	;
})(angular);

//lookup.js
(function(angular, undefined) {
	angular.module("noinfopath.ui")

	.directive("noLookup", ["$compile", "noFormConfig", "noDataSource", "$state", "noNCLManager", function($compile, noFormConfig, noDataSource, $state, noNCLManager) {
		function _compile(el, attrs) {
			var config, form, lookup, ncl, sel = angular.element("<select />"), noid = el.parent().parent().attr("noid");

			function useNacl() {
				config = noNCLManager.getHashStore($state.params.fid || $state.current.name.split(".").pop()); // designer vs viewer
				ncl = config.get(noid);
				form = ncl.noComponent;
				lookup = form.noLookup;

				renderNgOptions();

				if (lookup.required || (ncl && ncl.noElement.validators && ncl.noElement.validators.required)) sel.attr("required", "");

				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
					//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
				} else {
					sel.attr("ng-model", lookup.ngModel || (ncl && ncl.noComponent && ncl.noComponent.ngModel) ); //TODO replace with smarter logic

				}

			}

			function useFormConfig() {
				config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity);
				form = noInfoPath.getItem(config, attrs.noForm);
				lookup = form.noLookup;

				renderNgOptions();

				if (lookup.required) sel.attr("required", "");

				if (lookup.binding && lookup.binding === "kendo") {
					sel.attr("data-bind", "value:" + lookup.valueField);
					//el.append("<input type=\"hidden\" data-bind=\"value:" + lookup.textField +  "\">");
				} else {
					sel.attr("ng-model", lookup.ngModel); //TODO replace with smarter logic
					sel.attr("name", lookup.ngModel);
					el.attr("name", lookup.ngModel)
				}

			}

			function renderNgOptions() {
				if(angular.isArray(lookup.textField)){
					var textFields = [];

					for (i = 0; i < lookup.textField.length; i++){
						var item = "item." + lookup.textField[i];

						textFields.push(item);
					}

					sel.attr("ng-options", "item." + lookup.valueField + " as " + textFields.join(" + ' ' + ") + " for item in " + form.scopeKey);
				} else {
					sel.attr("ng-options", "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + form.scopeKey);
				}
			}

			if(noid) {
				useNacl();
			} else {
				useFormConfig();
			}


			//default to bootstrap
			sel.addClass(lookup.cssClasses || "form-control");

			el.empty();
			el.append(sel);

				return _link.bind(null, { config: config, form: form, lookup: lookup });
		}


		function _link(ctx, scope, el, attrs) {
			var config = ctx.config,
				form = ctx.form,
				lookup = ctx.lookup,
				sel = el.first();

			

			function populateDropDown(form, lookup) {
				var dataSource = noDataSource.create(form.noDataSource, scope, scope);

				dataSource.read()
					.then(function(data) {
						scope[form.scopeKey] = data;

					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.waitingForError);
					});

			}


			populateDropDown(form, lookup);
		}


		directive = {
			restrict: "E",
			compile: _compile,
			scope: false
		};

		return directive;
	}]);
})(angular);

//input.js
(function(angular, undefined) {
	/*
	 * <div class="no-ctrl-group" noid="NOIDbe97eec4fd53452ba72be0281d83bbad" dnd-list="" dnd-drop="">
	 * 	<label>Label</label>
	 * 	<control>
	 * 		<input class="form-control">
	 * 	</control>
	 * </div>
	 */
	function NoInputDirective(noNCLManager, $stateParams, $state) {
		function _compile(el, attrs) {
			var noid = el.parent().parent().attr("noid"),
				hashStore = noNCLManager.getHashStore($stateParams.fid || $state.current.name.split(".").pop()),
				ncl = hashStore.get(noid),
				noComponent = ncl.noComponent,
				cfg = ncl.noElement,
				input = angular.element("<input class=\"form-control\" ng-model=\""+ $stateParams.fid + "." + noComponent.ngModel +"\"></input>");
				//TODO reformat/make data source designer
			if(cfg.validators) {
				if(cfg.validators.required) input.attr("required", true);
			}

			el.append(input);

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")

	.directive("noInput", ["noNCLManager", "$stateParams", "$state", NoInputDirective])
	;

})(angular);

//btn-group.js
(function(angular, undefined) {
	/**
	*	### NoBtnGroupDirective
	*/
	function NoBtnGroupDirective($compile, noFormConfig, noDataSource, $state){
		function _link(scope, el, attrs) {
			function valueField(btn) {
				var to = btn.valueType ? btn.valueType : "string",
					fns = {
						"string": function(vf) {
							return "'{{v." + btn.valueField + "}}'";
						},
						"undefined": function(vf) {
							return "{{v." + btn.valueField + "}}";
						}
					},
					fk = fns[to] ? to : "undefined",
					fn = fns[fk];

				return fn(btn);
			}

			function _finish(form) {
				var config = noInfoPath.getItem(form, attrs.noForm),
					dataSource = noDataSource.create(config.noDataSource, scope, scope),
					template = '<div class="btn-group {noBtnGroup}"><label ng-repeat="v in {noDataSource}" class="{noItemClass}" ng-model="{noNgModel}" btn-radio="{noValueField}">{{v.{noTextField}}}</label></div>',
					btnGrp = config.noBtnGroup;

				template = template.replace("{noBtnGroup}", btnGrp.groupCSS);
				template = template.replace("{noDataSource}", config.scopeKey);
				template = template.replace("{noItemClass}", btnGrp.itemCSS);
				template = template.replace("{noValueField}", valueField(btnGrp));
				template = template.replace("{noTextField}", btnGrp.textField);
				template = template.replace("{noNgModel}", btnGrp.ngModel);

				el.append(angular.element(template));

				el.html($compile(el.contents())(scope));

				dataSource.read()
					.then(function(data) {
						scope[config.scopeKey] = data.paged;
						scope.waitingFor[config.scopeKey] = false;
					})
					.catch(function(err) {
						scope.waitingForError = {
							error: err,
							src: config
						};
						console.error(scope.waitingForError);
					});

			}

			_finish(noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope));


		}


		directive = {
			restrict: "EA",
			scope: false,
			compile: function(el, attrs) {


				return _link;
			}
		};

		return directive;

	}

	/**
	*	### NoButtonDirective
	*
	*	Extands a standard button element to support noActionQueue configurations
	*	that are store in `area.json` files.
	*
	*
	*	#### Configuration
	*
	*	```json
	*
	*	{
	*		myButtonConfig: {
				"actions": [
	*				{
	*					"provider": "$state",
	*					"method": "go",
	*					"noContextParams": true,
	*					"params": [
	*						"efr.project.search",
	*						{
	*							"provider": "noStateHelper",
	*							"method": "makeStateParams",
	*							"params": [
	*								{
	*									"key": "id",
	*									"provider": "scope",
	*									"property": "document.ProjectID.ID"
	*								}
	*							],
	*							"passLocalScope": true
	*						}
	*					]
	*				}
	*			]
	*		}
	*	}
	*
	*	```
	*
	*/
	function NoButtonDirective($state, noFormConfig, noActionQueue){


		function _link(scope, el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noButton", attrs.noForm);

			el.click(function (e) {
				e.preventDefault();

				var execQueue = noActionQueue.createQueue(ctx, scope, el, ctx.component.actions);

				delete scope.noNavigationError;

				return noActionQueue.synchronize(execQueue)
					.then(function (results) {
						//console.log(results);
					})
					.catch(function (err) {
						scope.noNavigationError = err;
						throw err;
					});

			});
		}

		return {
			restrict: "AE",
			link: _link
		};

	}

	angular.module("noinfopath.ui")
		.directive("noBtnGroup", ["$compile", "noFormConfig", "noDataSource", "$state", NoBtnGroupDirective])
		.directive("noButton", ["$state", "noFormConfig", "noActionQueue", NoButtonDirective])
	;
})(angular);

//data-panel.js
(function (angular, undefined) {
	angular.module("noinfopath.ui")
		/*
		 *   ##  noDataPanel
		 *
		 *   Renders a data bound panel that can contain
		 *   any kind of HTML content, which can be bound
		 *   data on $scope.  The data sources being bound
		 *   to, are NoInfoPath Data Providers. Note that
		 *   this directive calls noDataSource.one method,
		 *   only returns a single data object, not an array.
		 *
		 *   ### Sample Usage
		 *
		 *   This sample show how to use the noDataPanel
		 *   directive in your HTML markup.
		 *
		 *   ```html
		 *   <no-data-panel no-config="noForms.trialPlot.noComponents.selection"/>
		 *   ```
		 *
		 *   ### Sample Configuration
		 *
		 *   ```js
		 *   {
		 *       "selection": {
		 *           "scopeKey": "selection",
		 *           "dataProvider": "noWebSQL",
		 *           "databaseName": "FCFNv2",
		 *           "entityName": "vw_trialplot_selection",
		 *           "primaryKey": "TrialPlotID",
		 *           "lookup": {
		 *               "source": "$stateParams",
		 *           },
		 *           "templateUrl": "observations/selection.html"
		 *       }
		 *   }
		 *   ```
		 */


		// 	"cooperatorView": {
	     //       "scopeKey": "cooperatorView",
	     //       "noDataPanel": {
	     //         "refresh": {
	     //           "provider": "scope",
	     //           "property": "cooperator"
	     //         }
	     //       },
	     //       "noDataSource": {
	     //         "dataProvider": "noWebSQL",
	     //         "databaseName": "FCFNv2",
	     //         "entityName": "vw_cooperator_summary",
	     //         "primaryKey": "CooperatorID",
	     //         "filter": [
	     //           {
	     //             "field": "CooperatorID",
	     //             "operator": "eq",
	     //             "value": {
	     //               "source": "$stateParams",
	     //               "property": "id"
	     //             }
	     //           }
	     //         ]
	     //       }
	     //     }


		.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", "noAreaLoader", function ($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser, PubSub, noAreaLoader) {

			function _link(scope, el, attrs) {
				var config,
					resultType = "one",
					dataSource,
					noFormAttr = attrs.noForm,
					_scope;


				function finish(data) {


					if(resultType === "one") {


						if(!!data && data.paged) {
							noParameterParser.update(data.paged, _scope[config.scopeKey]);
						} else if(!!data){
							noParameterParser.update(data, _scope[config.scopeKey]);
						} else {
							noParameterParser.update({}, _scope[config.scopeKey]);
						}
					} else {
						if(!_scope[config.scopeKey]) {
							_scope[config.scopeKey] = [];
						}

						if(!!data && data.paged) {
							_scope[config.scopeKey] = data.paged;
						} else if(!!data){
							_scope[config.scopeKey] = data;
						} else {
							_scope[config.scopeKey] = [];
						}
					}

					if(config.hiddenFields) {
						for(var h in config.hiddenFields) {
							var hf = config.hiddenFields[h],
								value = noInfoPath.getItem(scope, hf.scopeKey);

							//console.log(hidden);
							noInfoPath.setItem(scope, hf.ngModel, value);
						}
					}

					if(_scope.waitingFor) {
						_scope.waitingFor[config.scopeKey] = false;
					}

					noAreaLoader.markComponentLoaded($state.current.name, noFormAttr);

					PubSub.publish("noDataPanel::dataReady", {config: config, data: data});
				}

				function refresh() {
					return dataSource[resultType]()
						.then(finish)
						.catch(error);
				}

				function error(err) {
					scope.waitingForError = {
						error: err,
						src: config
					};

					console.error(scope.waitingForError);
				}

				function watch(dsConfig, filterCfg, value, n, o, s) {
					console.log("noDataPanel::watch", this, dsConfig, filterCfg, value, n, o, s);
				}

				function noForm_ready(data) {
					config = noInfoPath.getItem(data, noFormAttr);

					noAreaLoader.markComponentLoading($state.current.name, noFormAttr);

					if(config.noDataPanel && config.noDataPanel.saveOnRootScope) {
						_scope = scope.$root;
					} else {
						_scope = scope;
					}

					if(!_scope[config.scopeKey]) {
						_scope[config.scopeKey] = {};
					}

					_scope[config.scopeKey + "_api"] = {};
					_scope[config.scopeKey + "_api"].refresh = refresh;

					if(config.noDataPanel) {
						resultType = config.noDataPanel.resultType ? config.noDataPanel.resultType : "one";

						if(config.noDataPanel.refresh) {
							scope.$watchCollection(config.noDataPanel.refresh.property, function (newval, oldval) {
								if(newval) {
									refresh();
								}
							});
						}

					}

					if(config.noDataSource) {
						dataSource = noDataSource.create(config.noDataSource, scope, watch);
					} else {
						dataSource = noDataSource.create(config, scope, watch);
					}

					if(config.templateUrl) {

						noTemplateCache.get(config.templateUrl)
							.then(function (tpl) {
								var t = $compile(tpl),
									params = [],
									c = t(scope);

								el.append(c);

								refresh();

							});
					} else {
						refresh();
					}
				}


				noForm_ready(noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope));

			}

			return {
				restrict: "E",
				link: _link,
				scope: false
			};
    }]);
})(angular);

//alpha-filter.js
(function(angular, undefined) {
	"use strict";

	angular.module("noinfopath.ui")
		.directive("noAlphaNumericFilter", [function() {

			function _link(scope, el, attrs) {
				var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
					nav = angular.element("<nav></nav>"),
					ul = angular.element('<ul class="pagination pagination-sm"></ul>'),
					itemOpen = '<li><span>',
					itemClose1 = '<span class="sr-only">',
					itemClose2 = '</span></li>';

				function _click(e) {
					var letter = angular.element(e.currentTarget);
					scope.noAlphaNumericFilter = letter.text();
					el.find("li").removeClass("active");
					letter.addClass("active");
					scope.$apply();
				}

				scope.noAlphaNumericFilter = "A";

				nav.append(ul);
				el.append(nav);

				for (var l = 0; l < letters.length; l++) {
					var tmp = angular.element(itemOpen + letters[l] + itemClose2);
					if (l === 0) {
						tmp.addClass("active");
					}
					ul.append(tmp);
					tmp.click(_click);
				}


			}

			return {
				restrict: "E",
				scope: false,
				link: _link
			};
	}]);
})(angular);

//title.js
(function(angular, undefined) {
	"use strict";

	angular.module("noinfopath.ui")
		.directive("noTitle", ["noDataSource", "noFormConfig", "$compile", "noConfig", "lodash", "$state", function(noDataSource, noFormConfig, $compile, noConfig, _, $state) {
			function _link(scope, el, attrs) {
				function _finish(data, scope) {
					var noFormCfg, noTitle;

					if (!data) throw "Form configuration not found for route " + toState.name;

					noTitle = data.noTitle;

					if (noTitle) {
						el.html($compile(noTitle.title)(scope));
						if (noTitle.noDataSource) {
							var dataSource = noDataSource.create(noTitle.noDataSource, scope);

							dataSource.one()
								.then(function(data) {
									noInfoPath.setItem(scope, "noTitle." + noTitle.scopeKey, data[noTitle.scopeKey]);
								})
								.catch(function(err) {
									console.error(err);
								});
						}
					}
				}

				scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

					_finish(noFormConfig.getFormByRoute(toState.name, toParams.entity, scope), event.targetScope);

				});

				_finish(noFormConfig.getFormByRoute($state.current.name, $state.params.entity), scope);

			}

			return {
				restrict: "E",
				scope: true,
				link: _link
			};
	}]);
})(angular);

//file-upload.js
(function (angular, undefined) {

	function NoFileUploadDirective($q, $state, noLocalFileStorage, noFormConfig) {
		function _done(comp, scope, el, blob) {
			var allScopeDocs = noInfoPath.getItem(scope, comp.ngModel);



			if(comp.multiple) {
				if(!allScopeDocs) {
					allScopeDocs = [];
					noInfoPath.setItem(scope, comp.ngModel, allScopeDocs);
				}

				allScopeDocs.push(blob);
			} else {
				noInfoPath.setItem(scope, comp.ngModel, blob);
				scope.$emit("NoFileUpload::dataReady", blob);
			}
			//_reset(el);
		}

		function _fault(err) {
			console.error(err);
		}

		function _progress(e) {
			console.info(e);
		}

		function _drop(comp, scope, el, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			try {
				var promises = [];
				if(e.originalEvent.dataTransfer) {
					var typeNames = e.originalEvent.dataTransfer.types,
						types = {
							files: e.originalEvent.dataTransfer.files,
							items: e.originalEvent.dataTransfer.items
						};
					for(var ti = 0; ti < typeNames.length; ti++) {
						var typeName = typeNames[ti],
							type = types[typeName.toLowerCase()];
						for(var i = 0; i < type.length; i++) {
							var item = type[i];

							promises.push(noLocalFileStorage.read(item, comp).finally(_progress, _progress));
							// promises.push(noLocalFileStorage.read(item, comp)
							// 	.then(_done.bind(null, comp, scope, el))
							// 	.catch(_fault));
						}
					}
				} else {
					var files = e.originalEvent.srcElement.files;
					for(var fi = 0; fi < files.length; fi++) {
						var file = files[fi];
						promises.push(noLocalFileStorage.read(file, comp).finally(_progress, _progress));
					}
				}

				$q.all(promises)
					.then(function(results){
						noInfoPath.setItem(scope, comp.ngModel, comp.multiple ? results : results[0]);
						//console.log(results);
					})
					.catch(function(err){
						console.error(err);
					});
			} catch(err) {
				console.error(err);
			}
			return false;
		}

		function _dragEnterAndOver(scope, el, config, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			if(attrs && attrs.noForm) {
				var comp = noInfoPath.getItem(config, attrs.noForm),
					filetype = comp.accept;

				if(filetype && filetype.indexOf(e.originalEvent.dataTransfer.items[0].type) === -1) {
					e.originalEvent.dataTransfer.dropEffect = "none";
					scope.$emit("NoFileUpload::illegalFileType");
				} else {
					e.originalEvent.dataTransfer.dropEffect = "copy";
					scope.$emit("NoFileUpload::legalFileType");
				}
			}
			return false;
		}

		function _dragLeave(e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			e.originalEvent.dataTransfer.dropEffect = "none";
			return false;
		}

		function _reset(el) {
			var ctrl = el.find("input")[0];

			try {
				ctrl.value = null;
			} catch(ex) {}

			if(ctrl.value) {
				ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
			}
		}

		function _template(el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity),
				comp = noInfoPath.getItem(config, attrs.noForm),
				accepts;

			if(angular.isArray(comp.accept)) {
				accepts = "accept=\"" + comp.accept + "\"";
			}else if(angular.isObject(comp.accept)){
				accepts = "accept=\"" + comp.accept[$state.params.type] + "\"";
			}else{
				accepts= "";
			}

			var ngModel = comp.ngModel ? "{{" + comp.ngModel + ".name || \"Drop File Here\" }}" : "",
				x, required = "", multiple = "";

			if (attrs.$attr.required || comp.required) required = " required";
			if (attrs.$attr.multiple || comp.multiple) multiple = " multiple";

			if(el.is(".no-flex")) {
				x = "<input type=\"file\" class=\"ng-hide\"" + accepts +  required + multiple + "><div class=\"no-flex\"><button class=\"no-flex\" type=\"button\">Choose a File</button><div class=\"no-flex\">" + ngModel + "</div></div>";

			} else {
				x = "<input type=\"file\" class=\"ng-hide\"" + accepts + required + multiple + "><div class=\"input-group\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\">Choose a File</button></span><div class=\"file-list\">" + ngModel + "</div></div>";
			}
			return x;
		}

		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
				comp = noInfoPath.getItem(config, attrs.noForm),
				input = el.find("input"),
				button = el.find("button");

			//noInfoPath.setItem(scope, comp.ngModel, undefined);

			el.bind("drop", _drop.bind(null, comp, scope, el, attrs));
			el.bind('dragenter', _dragEnterAndOver.bind(null, scope, el, config, attrs));
			el.bind('dragover', _dragEnterAndOver.bind(null, scope, el, config, attrs));
			el.bind('dragleave', _dragLeave);
			$("body")
				.bind("dragenter", _dragLeave);
			$("body")
				.bind("dragover", _dragLeave);
			button.click(function (e) {
				if(input) {
					input.click();
				}
				e.preventDefault();
			});

			input.bind("change", _drop.bind(null, comp, scope, el, attrs));
		}

		return {
			link: _link,
			template: _template,
			restrict: "E"
		};
	}
	angular.module("noinfopath.ui")
		.directive("noFileUpload", ["$q", "$state", "noLocalFileStorage", "noFormConfig", NoFileUploadDirective]);
})(angular);

//file-viewer.js
(function (angular, /*PDFJS, ODF,*/ undefined) {
	"use strict";


	function removeViewerContainer(el) {
		el.find(".no-file-viewer").remove();
	}

	function renderIframe(el, n) {
		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + n.blob + "\">iFrames not supported</iframe>");

		el.find(".no-file-viewer").html(iframe);
	}
	function renderIframe3(el, n) {
		console.log("no-file-viewer::renderIframe3", n, el);

		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + (n.url || n.blob) + "\">iFrames not supported</iframe>");

		el.html(iframe[0].outerHTML);
	}
	function renderIframe2(el, n) {
		var iframe = el.append("<iframe class=\"no-file-viewer no-flex-item size-1\">iFrames not supported</iframe>"),
			url = window.URL || window.webkitURL,
			blob =  new Blob([n.blob], {type: n.type});

		iframe.src = url.createObjectURL(blob);
	}

	function renderPDF(el, n) {
		// var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");
		//el.append(tmp);
		PDFObject.embed(n.blob, $(".no-file-viewer",el), {
			height: "auto",
			width: "auto"
		});

	}

	function renderODF(el, n) {
		el.html("<div style=\"position: fixed; left:0; right: 0; top: 300px; bottom: 100px; overflow: scroll;\"><div class=\"canvas\"></div></div>");

		var odfelement = el.find(".canvas")[0],
			odfCanvas = new odf.OdfCanvas(odfelement);

		odfCanvas.load(n.blob);
		// 	= new odf.OdfContainer(n.type, function(e){
		//    	//console.log(e);
		//    	odfCanvas.setOdfContainer(e);
		//    	odfContainer.setBlob(n.name, n.type, n.blob.split(";")[1].split(",")[1]);
		//
		//    });

	}

	function renderImage(el, n) {


		var c = el.find(".no-file-viewer"),
			img = angular.element("<img>");

		if(!!c) c = el;

		img.attr("src", n.url || n.blob);
		//img.addClass("full-width");
		img.css("height", "100%");
		img.css("width", "100%");

		c.html(img);
	}

	var mimeTypes = {
		"application/pdf": renderIframe3,
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
		"image": renderIframe3,
		"text/plain": renderIframe3,
		"text/html": renderIframe3
	};

	function render(el, n, msg) {

		$(el).empty();

		switch(n) {
			case "FILE_NOT_FOUND":
				el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '>" + (msg || "File Not Found") + "</h3></div>");
				break;
			case "LOADING":
				el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '><div class='progress'><div class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div></h3></div>");
				break;
			default:
				var type = n.fileObj ? n.fileObj.type : n.type,
					mime = type.toLowerCase().split("/");

				if(mime[0] === "image") {
					mime = mime[0];
				} else {
					mime = type;
				}
				//removeViewerContainer(el);
				if(msg) {
					renderImage(el, n);
				} else {
					mimeTypes[mime](el, n);
				}
				break;

		}

	}

	function NoFileViewer2Directive($compile, $state, $timeout, noLocalFileSystem) {
		function _clear(el) {
			$(".no-file-viewer",el).empty();
		}

		function _read(el, fileId, notFoundMessage) {
			if(fileId) {
				render(el, "LOADING");
				return noLocalFileSystem.getUrl(fileId)
					.then(function(file){
						if(!!file) {
							render(el, file, notFoundMessage);
						} else {
							render(el, "FILE_NOT_FOUND");
						}
					})
					.catch(function(err){
						console.error(err);
					});
			} else {
				render(el, "FILE_NOT_FOUND", notFoundMessage);
			}

		}

		function _compile(el, attrs) {

			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {
				scope.noFileViewer = {
					refresh: _read.bind(null, el)
				};

				if(attrs.url) {
					if(!attrs.type) throw "noFileViewer directive requires a type attribute when the url attribute is provided";
					render(el, {type: attrs.type, blob: attrs.url});
				} else if(attrs.fileId) {
					if(noInfoPath.isGuid(attrs.fileId)) {
						_read(el, attrs.fileId, !!attrs.showAsImage);
					} else {
						scope.$watch(attrs.waitFor, function(key, msg, n, o){
							//console.info("file-viewer watch: ", n, o);
							//if(n && noInfoPath.isGuid(n.ID)) {
							if(n) {
								//scope.noFileViewer.fileId = noInfoPath.getItem(n, key);
								_read(el, noInfoPath.getItem(n, key), msg);
								// if(scope.noFileViewer.fileId) {
								// } else {
								// 	render(el, "FILE_NOT_FOUND");
								// }
							} else {
								_clear();
							}
						}.bind(null, attrs.fileId, attrs.notFoundMessage));

						// scope.$watchCollection(attrs.waitFor, function(n, o){
						// 	//console.info("file-viewer watchCollection: ", n, o);
						// 	if(n && noInfoPath.isGuid(n.ID)) {
						// 		var fid = noInfoPath.getItem(n, attrs.fileId);
						// 		_read(fid, el);
						// 	} else {
						// 		_clear();
						// 	}
						// });
					}
				}else{
					scope.$watch(attrs.waitFor, function(n, o){
						if(n && n.FileID) _read(el, n.FileID);
					});
				}


			};

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		//.directive("noPdfViewer", ["$state", "noFormConfig", NoInfoPathPDFViewerDirective])
		.directive("noFileViewer", ["$compile", "$state", "$timeout", "noLocalFileSystem", NoFileViewer2Directive])
	;
})(angular /*, PDFJS, odf experimental code dependencies*/ );

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

//lookup.js
(function (angular, undefined) {
	angular.module("noinfopath.ui")
		.directive("noListView", ["$compile", "$injector", "noFormConfig", "$state", "noLoginService", "noDataSource", "lodash", "noTemplateCache", "PubSub", function ($compile, $injector, noFormConfig, $state, noLoginService, noDataSource, _, noTemplateCache, PubSub) {

			function _compile(el, attrs) {
				var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity),
					noForm = noInfoPath.getItem(config, attrs.noForm);
				//select = angular.element("<select></select>");

				//el.append(select);

				return _link.bind(null, noForm);
			}

			function _link(config, scope, el, attrs) {
				var template,
					ds;


				function _render(data) {
					console.log(data);
					for(var i=0; i < data.paged.length; i++) {
						var item = data.paged[i];

						el.append("<no-file-viewer file-id=\"" + item.FileID + "\"></no-file-viewer>");
					}

					el.html($compile(el.contents())(scope));
				}

				function _watch(dsConfig, filterCfg, valueObj, newval, oldval, scope) {
					var ds = scope[dsConfig.entityName];
					// 	filters = listview.dataSource.filter(),
					// 	filter = _.find(filters.filters, {
					// 		field: filterCfg.field
					// 	});

					// if(!filter) throw "Filter " + filterCfg.field + " was not found.";

					function handleDataBoundControlsSimple(){
						console.log("handleDataBoundControlsSimple");
						filter.value = newval;
					}

					function handleDataBoundControlsAdvanced(){
						var filter = {value: []};
						console.log("handleDataBoundControlsAdvanced");
						//Need to reconstitue the values
						for(var fi=0; fi<filterCfg.value.length; fi++){
							var valCfg = filterCfg.value[fi];

							if(valCfg.property === valueObj.property){
								filter.value[fi] = newval;
							}else{
								if(valCfg.source === "scope"){
									filter.value[fi] = noInfoPath.getItem(scope, valCfg.property);
								}else if(["$scope", "$stateParams"].indexOf(valCfg.source) > -1){
									var prov = $injector.get(valCfg.source);
									filter.value[fi] = noInfoPath.getItem(prov, valCfg.property);
								}else{
									console.warn("TODO: May need to implement other sources for dynamic filters", valCfg);
								}
							}
						}
					}

					console.log(ds);

					if(noInfoPath.isCompoundFilter(filterCfg.field)){
						//this.value[_.findIndex(this.value, {property: valueCfg.property})] = newval;
						handleDataBoundControlsAdvanced();
					}else{
						handleDataBoundControlsSimple();
					}

					ds.read()
						.then(_render)
						.catch(function(err){
							console.error(err);
						});

					// listview.dataSource.page(0);
					// listview.refresh();

				}

 				ds = noDataSource.create(config.noDataSource, scope, _watch);
				scope[config.noDataSource.entityName] = ds;


				noTemplateCache.get(config.noListView.templateUrl)
					.then(function (html) {
						template = html;

						ds.read()
							.then(_render)
							.catch(function(err){
								console.error(err);
							});
						//if(config.noListView.referenceOnParentScopeAs) scope.$parent[config.noListView.referenceOnParentScopeAs] = scope.noListView;
					})
					.catch(function (err) {
						console.error(err);
					});

				var pubID = PubSub.subscribe("noTabs::change", function(data){
					console.log("noTabs::change", arguments);
				});

				scope.$on("$dispose", function(){
					PubSub.unsubscribe(pubID);
				});
					//kendoOptions.value = noInfoPath.getItem(scope, config.noLookup.ngModel);

					// kendoOptions.change = function(e) {
					// 	var value = this.dataItem(this.current());
					//
					// 	if (!value) {
					// 		value = {};
					// 	}
					//
					// 	//value[kendoOptions.dataTextField] = this.value();
					//
					// 	noInfoPath.setItem(scope, config.noLookup.ngModel, this.value());
					// 	scope[config.noLookup.scopeKey].dirty = true;
					// 	scope.$apply();
					// };


				// if (config.noKendoLookup.waitFor) {
				// 	scope.$watch(config.noKendoLookup.waitFor.property, function(newval) {
				// 		if (newval) {
				// 			var values = _.pluck(newval, config.noKendoLookup.waitFor.pluck);
				//
				// 			noInfoPath.setItem(scope, config.noKendoLookup.ngModel, values);
				//
				// 			scope[config.scopeKey + "_lookup"].value(values);
				// 		}
				// 	});
				// }

			}


			directive = {
				restrict: "E",
				compile: _compile,
				scope: true
			};

			return directive;

		}]);

})(angular);

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

(function (angular) {
	function NoOverlayMessageDirective($state, noFormConfig) {
		function _templateUrl(el, attrs) {
			var url = attrs.url,
				ctx = !url && noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noOverlayMessage", attrs.noForm);

			if(!url && !ctx) throw {error: "noOverlayMessage directive requires either a url or no-forms attribute.", ctx: ctx};

			if(!url && ctx && !ctx.component) throw { error: "Cannot resolve component from provided context", ctx: ctx };

			if(!url && ctx && ctx.component) url = ctx.component.templateUrl;

			return url;
		}

		function _compile(el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noOverlayMessage", attrs.noForm);
			return _link.bind(this, ctx);
		}

		function _link(ctx, scope, el, attrs) {

		}

		return {
			strict: "EA",
			templateUrl: _templateUrl,
			compile: _compile
		};
	}

	function NoDnDCoverDirective() {
		var oldAddEventListener = EventTarget.prototype.addEventListener;

		EventTarget.prototype.addEventListener = function (eventName, eventHandler) {
			oldAddEventListener.call(this, eventName, function (event) {
				//if(!$preventAllEvents.is(':checked'))
					eventHandler(event);
			});
		};
		function _fault(err) {
			console.error(err);
		}

		function _drop(comp, scope, el, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			try {
				if(e.originalEvent.dataTransfer) {
					var typeNames = e.originalEvent.dataTransfer.types,
						types = {
							files: e.originalEvent.dataTransfer.files,
							items: e.originalEvent.dataTransfer.items
						};
					for(var ti = 0; ti < typeNames.length; ti++) {
						var typeName = typeNames[ti],
							type = types[typeName.toLowerCase()];
						for(var i = 0; i < type.length; i++) {
							var item = type[i];
							noLocalFileStorage.read(item, comp)
								.then(_done.bind(null, comp, scope, el))
								.catch(_fault);
						}
					}

				} else {
					var files = e.originalEvent.srcElement.files;
					for(var fi = 0; fi < files.length; fi++) {
						var file = files[fi];
						noLocalFileStorage.read(file, comp)
							.then(_done.bind(null, comp, scope, el))
							.catch(_fault);
					}
				}
			} catch(err) {
				console.error(err);
			}
			return false;
		}

		function _dragEnterAndOver(scope, el, config, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			if(attrs && attrs.noForm) {
				var comp = noInfoPath.getItem(config, attrs.noForm),
					filetype = comp.accept;

				if(filetype && filetype.indexOf(e.originalEvent.dataTransfer.items[0].type) === -1) {
					e.originalEvent.dataTransfer.dropEffect = "none";
					scope.$emit("NoFileUpload::illegalFileType");
				} else {
					e.originalEvent.dataTransfer.dropEffect = "copy";
					scope.$emit("NoFileUpload::legalFileType");
				}
			}
			return false;
		}

		function _dragLeave(e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			e.originalEvent.dataTransfer.dropEffect = "none";
			return false;
		}

		function _reset(el) {
			var ctrl = el.find("input")[0];

			try {
				ctrl.value = null;
			} catch(ex) {}

			if(ctrl.value) {
				ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
			}
		}

		return {
			"restrict": "E",
			"link": function (scope, el, attrs) {
				//must have a parent
				console.log(el.parent());
				el.css("position", "absolute");
				el.css("top", "0");
				el.css("bottom", "0");
				el.css("left", "0");
				el.css("right", "0");
				el.css("background-color", "rgba(0, 0, 0, 0.51)");
				el.css("z-index", "100");
				el.css("display", "none");

				el.parent().bind("drop", _drop.bind(null, {}, scope, el, attrs));
				el.parent().bind('dragenter', _dragEnterAndOver.bind(null, scope, el, {}, attrs));
				el.parent().bind('dragover', _dragEnterAndOver.bind(null, scope, el, {}, attrs));
				el.parent().bind('dragleave', _dragLeave);
				$("body")
					.bind("dragenter", _dragLeave);
				$("body")
					.bind("dragover", _dragLeave);

			}
		};
	}

	angular.module("noinfopath.ui")
		.directive("noDndCover", [NoDnDCoverDirective])
		.directive("noOverlayMessage", ["$state", "noFormConfig", NoOverlayMessageDirective])
		;
})(angular);

/*
 * ## noNotificationService
 *
 * Has the ability to create notifications in the DOM with a message and specific options.
 *
 * ### Sample Usage
 *
 * This sample show how to use the noNotificationService
 * service in your code.
 *
 * ```js
 * noNotificationService.appendMessage("Hello World", {id: "jawnjawnjawn"});
 * ```
 *
 * ### Sample Options
 *
 * ```js
 * {
 *     ttl: 1000, // Time to live in milliseconds
 *     dismissible: false, // If true, message will be stuck until dismissed
 *     type: "info" // A specific type that connects to bootstrap classes. Can be warning, info, danger, or success
 * }
 * ```
 * | Option Name | Description                                                                                                         |
 * |-------------|---------------------------------------------------------------------------------------------------------------------|
 * | ttl         | This is the time to live. It defaults to `1000` ms (1 second).                                                        |
 * | dismissable | This is default to `false`. If set to true, the notification will have an "x" and stay on the screen until dismissed. |
 * | type        | This corresponds to the bootstrap classes. Possible values are `warning`, `info`, `danger`, or `success`. Default is `info`.  |
 * | classes          | An array of CSS classes to add onto the notification                                   |
 * | id          | A specific id can be given so the same message cannot be shown repeatedly.                                    |
 *
 * ### How it Works
 * When append message is called, an element is appended to the DOM, off the `<no-notifications>` element.
 * It uses CSS defined in `_notification.scss`. `$interval` is used to update the `age` property on the element.
 * When the `age` is greater than the `ttl` defined in the options, the element is removed.
 */


//notify.js
(function(angular, undefined) {
    "use strict";

    function startup($rootScope) {
        $(window.top.document.body).append("<no-notifications></no-notifications>");
    }

    function NoNotificationService($interval, $rootScope) {
        var ids = [];

        var tpl = "<no-notification class=\"alert fadeIn\" role=\"alert\"></no-notification>",
            xtmp = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>",
            alertTypes = {
                "warning": "alert-warning",
                "info": "alert-info",
                "danger": "alert-danger",
                "success": "alert-success"
            },
            dismissible = "alert-dismissible",
            timeout = 1000,
            defaultOptions = {
                ttl: 1000, //in milliseconds
                dismissible: false,
                type: "info",
                classes: []
            },
            container = $("no-notifications");

        function _appendMessage(message, options) {
            var tmpOptions = angular.extend({}, defaultOptions, options),
                notifcation = $(tpl),
                btn = $(xtmp),
                classes = [alertTypes[tmpOptions.type]].concat(tmpOptions.classes);

            if (!tmpOptions.id) tmpOptions.id = noInfoPath.createUUID();

            if (ids.indexOf(tmpOptions.id) > -1) {
                return false;
            } else {
                ids.push(tmpOptions.id);
            }

            notifcation.addClass(classes.join(" "));
            notifcation.attr("message-id", tmpOptions.id);


            if (tmpOptions.dismissible) {
                notifcation.append(btn);
                notifcation.attr("ttl", -1);
                notifcation.attr("age", 0);
                notifcation.addClass(dismissible);
            } else {
                notifcation.attr("ttl", tmpOptions.ttl);
                notifcation.attr("age", 0);
            }

            notifcation.append(message);

            container.prepend(notifcation);

            if (tmpOptions.dismissible) btn.click(removeMessage.bind(null, notifcation));
        }
        this.appendMessage = _appendMessage;

        function removeMessage(el) {
            var messageId = el.attr("message-id"),
                messageIdNdx = ids.indexOf(messageId);

            ids.splice(messageIdNdx, 1);

            el.animate({
                opacity: 0,
                "padding-top": 0,
                "padding-bottom": 0,
                height: 0
            }, '200', function() {
                el.remove();
            });
        }

        function ageAndPurgeMessages() {
            var messages = container.children();

            for (var m = 0; m < messages.length; m++) {
                var el = $(messages[m]),
                    ttl = Number(el.attr("ttl")),
                    age = Number(el.attr("age"));

                if (ttl > -1) {
                    if (age >= ttl) {
                        removeMessage(el);
                        break;
                    } else {
                        el.attr("age", age + 1000);
                    }
                }
            }
        }

        $interval(ageAndPurgeMessages, timeout);
    }

    angular.module("noinfopath.ui")
        .run(["$rootScope", startup])
        .service("noNotificationService", ["$interval", "$rootScope", NoNotificationService]);
})(angular);
