//data-panel.js
(function(angular, undefined){
    angular.module("noinfopath.ui")
        /*
        *   ##  noDataPanel
        *
        *   Renders a data bound panel that can contain
        *   any kind of HTML content, which can be bound
        *   data on $scope.  The data sources being bound
        *   to, are NoInfoPath Data Providers.
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
        .directive("noDataPanel", ["$injector", "$http", "$compile", "noConfig", function($injector, $http, $compile, noConfig){

            return {
                restrict: "E",
                compile: function(el, attrs){
                    var config = noInfoPath.getItem(noConfig.current, attrs.noConfig);

                    // attrs.$set("ngInclude", "'" + config.templateUrl  + "'");

                    return function(scope, el, attrs){
                        var provider = $injector.get(config.dataProvider),
                            db = provider.getDatabase(config.databaseName),
                            entity = db[config.entityName],
                            luSource = $injector.get(config.lookup.source);

                        $http.get(config.templateUrl)
                            .then(function(resp){
                                var t = $compile(resp.data),
                                    params = [];
                                el.html(t(scope));

                                if(entity.constructor.name === "NoView"){
                                    params[1] = luSource;
                                    params[0] = config.primaryKey;
                                }else{
                                    params[1]  = luSource;
                                }

                                entity.noOne.apply(null, params)
                                    .then(function(data){
                                        scope[config.scopeKey] = data;
                                    });
                            });


                    };
                }
            };
        }])
    ;
})(angular);
