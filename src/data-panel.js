/*
 *  [NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 *  ___
 *
 *  [NoInfoPath UI (noinfopath-ui)](home) * @version 2.0.29 *
 *
 *  [![Build Status](http://gitlab.imginconline.com:8081/buildStatus/icon?job=noinfopath-ui&build=6)](http://gitlab.imginconline.com/job/noinfopath-data/6/)
 *
 *  Copyright (c) 2017 The NoInfoPath Group, LLC.
 *
 *  Licensed under the MIT License. (MIT)
 *
 *  ___
 *
 *
 *	## noDataPanel Directive
 *
 *	Renders a databound panel that can contain any kind of HTML content, which can be bound data on $scope. 
 *	The datasources bring bound to are NoInfoPath data providers.
 *
 *	### Sample HTML
 *
 *  ```html
 *  <no-data-panel no-form="noForms.noComponents.foo"/>
 *  ```
 *
 *	|Property|Description|
 *	|--------|-----------|
 *	|no-form|The property that the configuration is located for the NoDataPanel|
 *
 *	### Sample Configuration
 *
 *  ```json
 *  {
 *  	"foo": {
 *  		"scopeKey": "foo",
 *			"noDataPanel": {
 *				"version": 1,
 *				"saveOnRootScope": true,
 *				"resultType": "one"
 *				"refresh": {
 *					"property": "bar"
 *				},
 *				"templateUrl": "foo.html"
 *			},
 *			"noDataSource": {			
 *  			"dataProvider": "noWebSQL",
 *  			"databaseName": "testdb",
 *  			"entityName": "Foo",
 *  			"primaryKey": "FooID",
 *				"filter": [
 *					{
 *						"field": "FooID",
 *						"operator": "eq",
 *						"value": {
 *							"source": "$stateParams",
 *							"property": "id"
 *						}
 *					}
 *				]
 *  		}
 *  	}
 *	}
 *  ```
 *	
 *	|Configuration Property|Type|Description|
 *	|----------------------|----|-----------|
 *	|scopeKey|String|The property that the NoDataPanel directive will databind to|
 *	|noDataPanel|Object|A configuration object specific to the NoDataPanel directive|
 *	|noDataPanel.refresh|Object|An object holding configuration that will trigger the NoDataPanel to request data again|
 *	|noDataPanel.refresh.property|String|The property on the scope that the NoDataPanel to watch. On change, it will request the data again|
 *	|noDataPanel.resultType|String|Default `one`. The type of call that will be performed when the NoDataPanel uses the NoDataSource to query for data|
 *	|noDataPanel.saveOnRootScope|Boolean|Default false. Sets what NoDataPanel returns on the local scope if false, or the rootScope if true.|
 *	|noDataPanel.templateUrl|String|The path to an html document to load within the NoDataPanel directive|
 *	|noDataPanel.version|Interger|Default `1`. If version is `1`, NoDataPanel saves a [NoResults](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/classes) object to the scopeKey. If version is `2`, NoDataPanel saves a [NoDataModel](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/classes) object to the scopeKey|
 *	|noDataSource|Object|Configuration for NoInfoPath Data NoDataSource. Read more here: [NoDataSource](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/data-source)|	
*/

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
				// console.log("noDataPanel::watch", this, dsConfig, filterCfg, value, n, o, s);
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

				if (config.noDataPanel && config.noDataPanel.templateUrl) {

					noTemplateCache.get(config.noDataPanel.templateUrl)
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

			noAreaLoader.markComponentLoading($state.current.name, attrs.noForm);
      
      noDataPanel = angular.merge({}, defaultOptions, noDataPanel);

			if (noDataPanel.saveOnRootScope) {
				_scope = scope.$root;
			} else {
				_scope = scope;
			}

			if (!config.noDataSource) {
				throw "noDataPanel :: noDataSource is not defined";
			}

			_scope[ctx.component.scopeKey] = new noInfoPath.data.NoDataModel(dataSource);

			if (noDataPanel.refresh) {
				scope.$watchCollection(noDataPanel.refresh.property, function (newval, oldval) {
					if (newval) {
						refresh();
					}
				});
			}			

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
				noDataPanel = angular.merge({}, {version: "1"}, ctx.component.noDataPanel);

			if(noDataPanel.version === "1") {
				version1(scope, el, attrs, ctx);
			} else {
				version2(scope, el, attrs, noDataPanel, ctx);
			}
		}

		return {
			restrict: "E",
			link: _link,
			scope: false
		};
	}

	angular.module("noinfopath.ui")
		.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", "noAreaLoader", NoDataPanelDirective])
	;
})(angular);
