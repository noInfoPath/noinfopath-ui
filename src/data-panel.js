//data-panel.js
(function(angular, undefined) {
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
		.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", function($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser) {

			function _link(scope, el, attrs) {
				var config,
					resultType = "one",
					dataSource,
					noFormAttr = attrs.noForm;

				function finish(data) {
					if (data.paged) {
						noParameterParser.update(data.paged, scope[config.scopeKey]);
					} else {
						noParameterParser.update(data, scope[config.scopeKey]);
					}

					if (config.hiddenFields) {
						for (var h in config.hiddenFields) {
							var hf = config.hiddenFields[h],
								value = noInfoPath.getItem(scope, hf.scopeKey);

							//console.log(hidden);
							noInfoPath.setItem(scope, hf.ngModel, value);
						}
					}

					if (scope.waitingFor) {
						scope.waitingFor[config.scopeKey] = false;
					}


				}

				function error(err) {
					scope.waitingForError = {
						error: err,
						src: config
					};

					console.error(scope.waitingForError);
				}

				function noForm_ready(data) {
					config = noInfoPath.getItem(data, noFormAttr);

					if (config.noDataPanel) {
						resultType = config.noDataPanel.resultType ? config.noDataPanel.resultType : "one";

						if (config.noDataPanel.refresh) {
							scope.$watchCollection(config.noDataPanel.refresh.property, function(newval, oldval) {
								if (newval) {
									dataSource[resultType]()
										.then(finish)
										.catch(error);
								}
							});
						}

					}

					if (config.noDataSource) {
						dataSource = noDataSource.create(config.noDataSource, scope);
					} else {
						dataSource = noDataSource.create(config, scope);
					}

					if (config.templateUrl) {

						noTemplateCache.get(config.templateUrl)
							.then(function(tpl) {
								var t = $compile(tpl),
									params = [],
									c = t(scope);

								el.append(c);

								dataSource[resultType]()
									.then(finish)
									.catch(error);
							});
					} else {
						dataSource[resultType]()
							.then(finish)
							.catch(error);
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
