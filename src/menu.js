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
