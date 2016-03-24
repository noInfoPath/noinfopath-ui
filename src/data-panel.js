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
		 *   <no-data-panel no-form="noForm.noComponents.selection"/>
		 *   ```
		 *
		 *   ### Sample Configuration
		 *
		 *   ```js
		 *   //TODO: add example configuration here.
		 *   ```
		 */
		.directive("noDataPanel", ["$injector", "$q", "$http", "$compile", "noFormConfig", "noDataSource", "$state", function($injector, $q, $http, $compile, noFormConfig, noDataSource, $state) {

			function _link(scope, el, attrs) {
				var config,
					resultType = "one",
					dataSource,
					noFormAttr = attrs.noForm;

				function finish(data) {
					if (data.paged) {
						scope[config.scopeKey] = data.paged;
					} else {
						scope[config.scopeKey] = data;
					}

					/*
					*	@property hiddenFields
					*
					*	Ensures the hidden imput tags are updated.
					*
					*	> Not sure this is still needed.  May be deprecated in the future.
					*/
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

					console.error(scope.$root.waitingForError);
				}

				function noForm_ready(data) {
					config = noInfoPath.getItem(data, noFormAttr);

					if (config.noDataPanel) {
						/*
						*	## @property noComponents.noDataPanel
						*
						*	Contains configuration properties specific to noDataPanel
						*	when configuring a NoInfoPath Component using the `noForms`
						*	configuration schema.
						*
						*	### @property noDataPanel.resultType (Default Value: `one`)
						*
						*	Allows the noDataPanel to retrieve rows of data via the underlying
						*	`noDataSource::read` method or a single object via `noDataSource:one`
						*	method. The
						*
						*/
						resultType = config.noDataPanel.resultType ? config.noDataPanel.resultType : "one";

						/*
						*	### @property noDataPanel.refresh
						*
						*	This property is an object that determines if the noDataPanel watches
						*	a particuar property on the scope to change. When it does the underlying
						*	noDataSource is requeried using the configured `resultType` property.
						*
						*	> NOTE: `noDataPanel.refresh` uses $watchCollection so if any child property
						*	> of the scope object changes this noDataPanel will react to it.
						*
						*	#### Child properties
						*
						*	|Name|Description|
						*	|----|-----------|
						*	|property|Name of the scope property to watch.|
						*
						*/
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

					/*
					*	@property noComponents.noDataPanel
					*
					*	This property provides the configuration required to retrieve data
					*	via a NoInfoPath Data Provider service.  See NoInfoPath Data module
					*	for more information on how to configure a NoInfoPath data source.
					*
					*/
					if (config.noDataSource) {
						dataSource = noDataSource.create(config.noDataSource, scope);
					} else {
						dataSource = noDataSource.create(config, scope);
					}

					/*
					*	@property noComponents.templateUrl
					*
					*	When provided, retrieve the HTML template to data bind to.
					*
					*	> TODO: Move this to noDataPanel configuration property.
					*/
					if (config.templateUrl) {
						$http.get(config.templateUrl)
							.then(function(resp) {
								var t = $compile(resp.data),
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


				noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
					.then(noForm_ready)
					.catch(error);
			}

			return {
				restrict: "E",
				link: _link,
				scope: false
			};
    }]);
})(angular);
