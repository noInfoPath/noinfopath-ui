//data-panel.js
(function (angular, undefined) {
    "use strict";

	function NoDataPanelDirective($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser, PubSub, noAreaLoader) {
		function version1(scope, el, attrs, ctx) {
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

		function version2(scope, el, attrs, ctx) {	
		    //NOTE: 1) noFormAttr not defined.
			noAreaLoader.markComponentLoading($state.current.name, noFormAttr);

            //NOTE: 2) Use config.noDataPanel = angular.merge({}, defaultOptions, config.noDataPanel) instead of 
            //      checking for the existence of `config.noDataPanel`.  So, create a variable called `defaultOptions`
            //      and add default properties as needed.
			if (config.noDataPanel && config.noDataPanel.saveOnRootScope) {
				_scope = scope.$root;
			} else {
				_scope = scope;
			}

            //NOTE: 3) As of V2 putting data source configuration directly on the config object is no longer
            //      supported. So this `if` statement is not requried. Throw and exception if the the
            //      `noDataSource` property is missing.
			if (config.noDataSource) {
				dataSource = noDataSource.create(config.noDataSource, scope, watch);
			} else {
				dataSource = noDataSource.create(config, scope, watch);
			}

            //NOTE: 4) `scope` should be `_scope`
			scope[ctx.component.scopeKey] = new noInfoPath.data.NoDataModel(dataSource);

            //NOTE: 5) Again, based on note #2 config.noDataPanel will always exists. Add `resultType: "one"`
            //      to the `defaultOptions`. Remove the outer `if` statement and remove the assignment to
            //      the `resultType`.
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

            //NOTE: 6) Move `templateUrl property to `noDataPanel` property.
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

		function _link(scope, el, attrs) {
			var config,  //NOTE: 7) Delete, ctx parameter will have what you need once you are in the Version functions.
				resultType = "one",  //NOTE: 8) Delete; see note #5.
				dataSource, //NOTE: 9) Delete; declare in the Version functions.
				noFormAttr = attrs.noForm, //NOTE: 10) Delete; see note #1.
				_scope, //NOTE: 11) Delete; declare in the Version functions.
				ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, scope),
				noDataPanel = angular.merge({}, {version: "1"}, ctx.component.noDataPanel);  //NOTE: 12a) pass this in to Version2 as a parameter.

			if(noDataPanel.version === "1") {
				version1(scope, el, attrs, ctx);
			} else {
				version2(scope, el, attrs, ctx);  //NOTE: 12b) New Prototype: Version2(scope, el, attrs, noDataPanel, ctx)
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


	.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", "noAreaLoader", NoDataPanelDirective])
	;
})(angular);
