/*
 *  [NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 *  ___
 *
 *  [NoInfoPath UI (noinfopath-ui)](home) * @version 2.0.57 *
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

	function NoDataPanelDirective($injector, $q, $compile, noFormConfig, noDataSource, noTemplateCache, $state, noParameterParser, PubSub, noAreaLoader, noActionQueue) {
		function _resolveScope(saveOnRootScope, scope, compKey) {
			return $q(function (resolve, reject) {
				try {
					var tmpScope = scope,
						tmpVal, tmpApi;

					tmpScope = saveOnRootScope ? scope.$root : scope;

					if (compKey) {
						tmpVal = noInfoPath.getItem(tmpScope, compKey);
						if (tmpVal) {
							noInfoPath.setItem(tmpScope, compKey, tmpVal);
							resolve(tmpScope);
						} else {
							//noInfoPath.setItem(tmpScope, compKey, {}); //Possible BUG

							var unwatch = scope.$watch(compKey, function (unwatch, n, o, s) {
								//console.log(n, o);
								if (n) {
									noInfoPath.setItem(s, compKey, n);
									if (unwatch) unwatch();
								}
							}.bind(null, unwatch));

							resolve(tmpScope);
						}

						tmpApi = noInfoPath.getItem(tmpScope, compKey + "_api");
						noInfoPath.setItem(tmpScope, compKey + "_api", angular.extend({}, tmpApi));
					} else {
						resolve(tmpScope);
					}


				} catch (err) {
					reject(err);
				}

			});

		}

		function _placeModelOnScope(schema, scopeKey, scope, noWrapper) {
			var srcModel = noInfoPath.getItem(scope, scopeKey),
				wrappedModel,
				entityCfg = noInfoPath.getItem(scope, "noDbSchema_" + schema.databaseName).entity(schema.entityName);

			if (srcModel) {
				wrappedModel = noWrapper ? srcModel : new noInfoPath.data.NoDataModel(entityCfg, srcModel);
				noInfoPath.setItem(scope, scopeKey, wrappedModel);
			}
		}

		function _setupWatches(resultType, compKey, dataPanel, dataSource, scope, refresh) {
			var unbinders = [];

			noInfoPath.setItem(scope, compKey + "_api.refresh", refresh);

			if (dataPanel.refresh && dataPanel.refresh.property) {
				unbinders.push(scope.$watchCollection(dataPanel.refresh.property, function (refresh, newval, oldval) {
					if (newval && newval !== oldval) {
						refresh();
					}
				}.bind(null, refresh)));
			}

			return unbinders;
		}

		function _resolveTemplate(scope, dataPanel, refresh) {
			if (dataPanel.templateUrl) {
				noTemplateCache.get(dataPanel.templateUrl)
					.then(function (tpl) {
						var t = $compile(tpl),
							params = [],
							c = t(scope);

						el.append(c);
						if (!dataPanel.refresh) refresh();
					});
			} else {
				if (!dataPanel.refresh) refresh();
			}
		}

		function _resolveDataSource(dsCfg, scope, fn) {
			if (dsCfg) {
				return noDataSource.create(dsCfg, scope, fn);
			} else {
				throw "noDataPanel::noDataSource is not defined";
			}

		}

		function _refresh(scope, resultType, dataSource, noDataPanel, finish, error) {
			return dataSource[resultType]()
				.then(function (data) {
					if (noDataPanel.actions) {
						var queue = noActionQueue.createQueue(data, scope, null, noDataPanel.actions);

						return noActionQueue.synchronize(queue)
							.then(function (results) {
								return results[0];
							});
					} else {
						return data;
					}

				})
				.then(finish)
				.catch(function (err) {
					if (noDataPanel.httpBadRequestAllowed) {
						finish({});
					} else {
						throw err;
					}
				});
		}

		function _error(scope, config, err) {
			scope.waitingForError = {
				error: err,
				src: config
			};

			console.error(scope.waitingForError);
		}

		function _watch(dsConfig, filterCfg, value, n, o, s) {
			console.log("noDataPanel::watch", dsConfig, filterCfg, value, n, o, s);
		}

		function _resolveResultType(resultType) {
			return resultType ? resultType : "one";
		}

		function _unfollow_data(schema, data) {
			var foreignKeys = schema.foreignKeys || {};

			for (var fks in foreignKeys) {

				var fk = foreignKeys[fks],
					datum = data[fk.column];

				if (datum) {
					data[fk.column] = datum[fk.refColumn] || datum;
				}
			}

			return data;
		}

		function version1(stateName, scope, el, attrs, ctx) {
			var _config,
				_scope,
				_dataSource,
				_curriedFinish,
				_curriedError,
				_unbinders = [],
				_resultType = "one",
				noFormAttr = attrs.noForm,
				dataPanel = angular.merge({}, {
					version: "1",
					resultType: "one"
				}, ctx.component.noDataPanel);

			function __finish(ctx, stateName, resultType, dataSource, scope, data) {
				if (resultType === "one") {
					if (!!data && data.paged) {
						noParameterParser.update(data.paged, scope[ctx.component.scopeKey]);
					} else if (!!data) {
						noParameterParser.update(data, scope[ctx.component.scopeKey]);
					} else {
						noParameterParser.update({}, scope[ctx.component.scopeKey]);
					}
				} else {
					if (!scope[ctx.component.scopeKey]) {
						scope[ctx.component.scopeKey] = [];
					}

					if (!!data && data.paged) {
						scope[ctx.component.scopeKey] = data.paged;
					} else if (!!data) {
						scope[ctx.component.scopeKey] = data;
					} else {
						scope[ctx.component.scopeKey] = [];
					}
				}

				if (ctx.component.hiddenFields) {
					for (var h in ctx.component.hiddenFields) {
						var hf = ctx.component.hiddenFields[h],
							value = noInfoPath.getItem(scope, hf.scopeKey);

						noInfoPath.setItem(scope, hf.ngModel, value);
					}
				}

				if (scope.waitingFor) {
					scope.waitingFor[ctx.component.scopeKey] = false;
				}

				noAreaLoader.markComponentLoaded(stateName, ctx.componentKey);

				PubSub.publish("noDataPanel::dataReady", {
					config: ctx.component,
					data: data
				});
			}

			noAreaLoader.markComponentLoading($state.current.name, attrs.noForm);

			_config = noInfoPath.getItem(data, attrs.noForm);

			_resultType = _resolveResultType(dataPanel.resultType);

			_scope = _resolveScope(dataPanel.saveOnRootScope, scope);

			_dataSource = _resolveDataSource(ctx.component.noDataSource, scope, _watch);

			_placeModelOnScope(ctx.datasource, ctx.component.scopeKey, _scope, true);

			_curriedFinish = __finish.bind(null, ctx, $state.current.name, _resultType, _dataSource, _scope);

			_curriedError = _error.bind(null, scope, _config);

			_curriedRefresh = _refresh.bind(null, scope, _resultType, _dataSource, _dataPanel, _curriedFinish, _curriedError);

			_unbinders = _setupWatches(_resultType, ctx.component.scopeKey, dataPanel, _dataSource, scope, _curriedRefresh);


			_resolveTemplate(scope, dataPanel, _curriedRefresh);


			noForm_ready(ctx.form);

			return $q.when(_unbinders);
		}

		function version2(stateName, scope, el, attrs, ctx) {
			var _config,
				_resultType,
				_scope,
				_dataSource,
				_curriedFinish,
				_curriedError,
				_curriedRefresh,
				_unbinders = [],
				_dataPanel = angular.merge({}, {
					version: 2,
					resultType: "one"
				}, ctx.component.noDataPanel),
				_schema = scope["noDbSchema_" + ctx.datasource.databaseName].entity(ctx.datasource.entityName);

			function __finish(ctx, stateName, resultType, dataSource, scope, data) {
				if (resultType === "one") {
					var model = noInfoPath.getItem(_scope, ctx.component.scopeKey);

					if (model) {

						//save new data to the scope, with object values resolved.
						model.current = noInfoPath.data.NoDataModel.clean(data, _schema);
						model.commit();
						noInfoPath.setItem(scope, ctx.component.scopeKey, model.current);

						if (ctx.widget.saveFollowed) {
							noInfoPath.setItem(scope, ctx.component.scopeKey, data);
						}

						for (var c in _schema.columns) {
							var col = _schema.columns[c],
								ctrl = model[c];


							if (ctrl) {
								if (ctrl.$viewValue === "[object Object]") {
									noInfoPath.data.NoDataModel.ngModelHack(ctrl, data[c]);
								}
								//console.log(c, ctrl, ctrl.$viewValue, data[c]);
							}
						}

					} else {
						noInfoPath.setItem(scope, ctx.component.scopeKey, data);
					}


				} else {
					if (!_scope[ctx.component.scopeKey]) {
						_scope[ctx.component.scopeKey] = [];
					}

					if (!!data && data.paged) {
						_scope[ctx.component.scopeKey] = data.paged;
					} else if (!!data) {
						_scope[ctx.component.scopeKey] = data;
					} else {
						_scope[ctx.component.scopeKey] = [];
					}
				}

				if (ctx.component.hiddenFields) {
					for (var h in ctx.component.hiddenFields) {
						var hf = ctx.component.hiddenFields[h],
							value = noInfoPath.getItem(scope, hf.scopeKey);

						noInfoPath.setItem(scope, hf.ngModel, value);
					}
				}

				//Deprecated for version2.  noAreaLoader replaces this
				if (_scope.waitingFor) {
					_scope.waitingFor[ctx.component.scopeKey] = false;
				}

				noAreaLoader.markComponentLoaded($state.current.name, attrs.noForm);

				PubSub.publish("noDataPanel::dataReady", {
					config: ctx.component,
					data: data
				});
			}

			noAreaLoader.markComponentLoading($state.current.name, attrs.noForm);

			_config = ctx.component; //noInfoPath.getItem(ctx.form, attrs.noForm);

			_resultType = _resolveResultType(_dataPanel.resultType);

			//console.log(ctx);
			return _resolveScope(_dataPanel.saveOnRootScope, scope, ctx.component.scopeKey)
				.then(function (scope) {
					_scope = scope;

					_dataSource = _resolveDataSource(ctx.component.noDataSource, scope, _watch);

					_placeModelOnScope(ctx.datasource, ctx.component.scopeKey, _scope);

					_curriedFinish = __finish.bind(null, ctx, $state.current.name, _resultType, _dataSource, _scope);

					_curriedError = _error.bind(null, scope, _config);

					_curriedRefresh = _refresh.bind(null, scope, _resultType, _dataSource, _dataPanel, _curriedFinish, _curriedError);

					_unbinders = _setupWatches(_resultType, ctx.component.scopeKey, _dataPanel, _dataSource, scope, _curriedRefresh);

					_resolveTemplate(scope, _dataPanel, _curriedRefresh);

					return _unbinders;
				})
				.catch(function (err) {
					console.error(err);
				});


		}

		function _link(scope, el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noDataPanel", attrs.noForm),
				ver = angular.extend({}, {
					version: 1
				}, ctx.component.noDataPanel).version,
				promise;

			if (Number(ver) === 1) {
				promise = version1($state.current.name, scope, el, attrs, ctx);

			} else {
				promise = version2($state.current.name, scope, el, attrs, ctx);
			}

			promise.then(function (unbinders) {
				scope.$on("$destroy", function (unbinders) {
					if (unbinders) {
						unbinders.forEach(function (unbind) {
							unbind();
						});
					}
				}.bind(null, unbinders));
			});

		}

		return {
			restrict: "E",
			link: _link,
			scope: false
		};
	}

	angular.module("noinfopath.ui")
		.directive("noDataPanel", ["$injector", "$q", "$compile", "noFormConfig", "noDataSource", "noTemplateCache", "$state", "noParameterParser", "PubSub", "noAreaLoader", "noActionQueue", NoDataPanelDirective]);
})(angular);
