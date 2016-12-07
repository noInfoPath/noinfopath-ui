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


		.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", function ($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser, PubSub) {

			function _link(scope, el, attrs) {
				var config,
					resultType = "one",
					dataSource,
					noFormAttr = attrs.noForm;


				function finish(data) {
					var s;

					if(config.noDataPanel && config.noDataPanel.saveOnRootScope) {
						s = scope.$root;
					} else {
						s = scope;
					}
					if(resultType === "one") {
						if(!s[config.scopeKey]) {
							s[config.scopeKey] = {};
						}
						
						if(data.paged) {
							noParameterParser.update(data.paged, s[config.scopeKey]);
						} else {
							noParameterParser.update(data, s[config.scopeKey]);
						}
					} else {
						if(!s[config.scopeKey]) {
							s[config.scopeKey] = [];
						}
						if(data.paged) {
							s[config.scopeKey] = data.paged;
						} else {
							s[config.scopeKey] = data;
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

					if(scope.waitingFor) {
						scope.waitingFor[config.scopeKey] = false;
					}

					PubSub.publish("noDataPanel::dataReady", {config: config, data: data});
				}

				function refresh() {
					dataSource[resultType]()
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

					scope[config.scopeKey + "_api"] = {};
					scope[config.scopeKey + "_api"].refresh = refresh;

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
