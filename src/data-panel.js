//data-panel.js
(function (angular, undefined) {
    "use strict";

	function NoDataPanelDirective($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser, PubSub, noAreaLoader) {
		function version1(scope, el, attrs, ctx) {
			var _scope;

			function finish(data) {
				if (resultType === "one") {
					if (!!data && data.paged) {
						noParameterParser.update(data.paged, _scope[config.scopeKey]);
					} else if (!!data) {
						noParameterParser.update(data, _scope[config.scopeKey]);
					} else {
						noParameterParser.update({}, _scope[config.scopeKey]);
					}
				} else {
					if (!_scope[config.scopeKey]) {
						_scope[config.scopeKey] = [];
					}

					if (!!data && data.paged) {
						_scope[config.scopeKey] = data.paged;
					} else if (!!data) {
						_scope[config.scopeKey] = data;
					} else {
						_scope[config.scopeKey] = [];
					}
				}

				if (config.hiddenFields) {
					for (var h in config.hiddenFields) {
						var hf = config.hiddenFields[h],
							value = noInfoPath.getItem(scope, hf.scopeKey);

						//console.log(hidden);
						noInfoPath.setItem(scope, hf.ngModel, value);
					}
				}

				if (_scope.waitingFor) {
					_scope.waitingFor[config.scopeKey] = false;
				}

				noAreaLoader.markComponentLoaded($state.current.name, noFormAttr);

				PubSub.publish("noDataPanel::dataReady", {
					config: config,
					data: data
				});
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

				if (config.noDataPanel && config.noDataPanel.saveOnRootScope) {
					_scope = scope.$root;
				} else {
					_scope = scope;
				}

				if (!_scope[config.scopeKey]) {
					_scope[config.scopeKey] = {};
				}

				_scope[config.scopeKey + "_api"] = {};
				_scope[config.scopeKey + "_api"].refresh = refresh;

				if (config.noDataPanel) {
					resultType = config.noDataPanel.resultType ? config.noDataPanel.resultType : "one";

					if (config.noDataPanel.refresh) {
						scope.$watchCollection(config.noDataPanel.refresh.property, function (newval, oldval) {
							if (newval) {
								refresh();
							}
						});
					}

				}

				if (config.noDataSource) {
					dataSource = noDataSource.create(config.noDataSource, scope, watch);
				} else {
					dataSource = noDataSource.create(config, scope, watch);
				}

				if (config.templateUrl) {

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

			noForm_ready(ctx.form);

		}

		function version2(scope, el, attrs, noDataPanel, ctx) {
			var defaultOptions = {
      	resultType: "one"
      },
      _scope;	
	    //NOTE: 1) noFormAttr not defined.
			noAreaLoader.markComponentLoading($state.current.name, attrs.noForm);

      //NOTE: 2) Use config.noDataPanel = angular.merge({}, defaultOptions, config.noDataPanel) instead of 
      //      checking for the existence of `config.noDataPanel`.  So, create a variable called `defaultOptions`
      //      and add default properties as needed.
      
      noDataPanel = angular.merge({}, defaultOptions, noDataPanel);

			if (noDataPanel.saveOnRootScope) {
				_scope = scope.$root;
			} else {
				_scope = scope;
			}

      //NOTE: 3) As of V2 putting data source configuration directly on the config object is no longer
      //      supported. So this `if` statement is not requried. Throw and exception if the the
      //      `noDataSource` property is missing.
			if (!config.noDataSource) {
				throw "noDataPanel :: noDataSource is not defined";
			}

      //NOTE: 4) `scope` should be `_scope`
			_scope[ctx.component.scopeKey] = new noInfoPath.data.NoDataModel(dataSource);

      //NOTE: 5) Again, based on note #2 config.noDataPanel will always exists. Add `resultType: "one"`
      //      to the `defaultOptions`. Remove the outer `if` statement and remove the assignment to
      //      the `resultType`.
			if (noDataPanel.refresh) {
				scope.$watchCollection(noDataPanel.refresh.property, function (newval, oldval) {
					if (newval) {
						refresh();
					}
				});
			}			

      //NOTE: 6) Move `templateUrl property to `noDataPanel` property.
			if (noDataPanel.templateUrl) {
				noTemplateCache.get(noDataPanel.templateUrl)
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

		function _link(scope, el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, scope),
				noDataPanel = angular.merge({}, {version: "1"}, ctx.component.noDataPanel);  //NOTE: 12a) pass this in to Version2 as a parameter.

			if(noDataPanel.version === "1") {
				version1(scope, el, attrs, ctx);
			} else {
				version2(scope, el, attrs, noDataPanel, ctx);  //NOTE: 12b) New Prototype: Version2(scope, el, attrs, noDataPanel, ctx)
			}
		}

		return {
			restrict: "E",
			link: _link,
			scope: false
		};
	}

	angular.module("noinfopath.ui")
	    //NOTE:  13) Document all properties in detail.
		/*
		 *   ##  noDataPanel
		 *
		 *   Renders a data bound panel that can contain
		 *   any kind of HTML content, which can be bound
		 *   data on $scope.  The data sources being bound
		 *   to are NoInfoPath Data Providers. 
		 *
		 *   ### Sample Usage
		 *
		 *   This sample show how to use the noDataPanel
		 *   directive in your HTML markup.
		 *
		 *   ```html
		 *   <no-data-panel no-config="noForms.noComponents.selection"/>
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

	.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", "noAreaLoader", NoDataPanelDirective])
	;
})(angular);
