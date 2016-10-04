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
