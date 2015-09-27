//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "noConfig", "noDataSource", function($compile, noConfig, noDataSource){


            function _link(scope, el, attrs){

                var config = noInfoPath.getItem(noConfig.current, attrs.noConfig),
                    lookup = config.noLookup,
                    dataSource = noDataSource.create(config.noDataSource, scope);

                    //el.html($compile(el.contents())(scope));

                    dataSource.read()
    					.then(function(data){
    						scope[config.scopeKey] = data;
    					})
                        .catch(function(err){
                            console.error(err);
                        });

                    scope.$watch(config.scopeKey, function(newval, oldval, scope){
                        if(newval){
                            var lookup = config.noLookup,
                                sel = angular.element("<select></select>"),
                                opt = "<option></option>";

                            for(var i in newval){
                                var item = newval[i],
                                    tmp = angular.element(opt);

                                tmp.attr("value", item[lookup.valueField]);
                                tmp.text(item[lookup.textField]);

                                sel.append(tmp);
                            }

                            sel.addClass("form-control");
                            sel.attr("ng-model", lookup.ngModel);

                            this.empty();
                            this.append(sel);
                            this.html($compile(this.contents())(scope));

                        }
                    }.bind(el));
            }

            function _compile(el, attrs){
                var config = noInfoPath.getItem(noConfig.current, attrs.noConfig),
                    lookup = config.noLookup,
                    sel = angular.element("<select></select>"),
                    opts = "item." + lookup.valueField + " as item." + lookup.textField + " for item in " + config.scopeKey;

                attrs.$addClass("form-control");

                attrs.$set("ng-model", config.ngModel);

                attrs.$set("ng-options", opts);


                el.append(sel);

                return _link;
            }

            directive = {
                restrict:"E",
                link: _link
            };

            return directive;
        }])
    ;
})(angular);
