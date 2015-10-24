//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noLookup",["$compile", "noFormConfig", "noDataSource", "$state", function($compile, noFormConfig, noDataSource, $state){


            function _link(scope, el, attrs){

                function _finish(form){
					var config =  noInfoPath.getItem(form, attrs.noForm),
						dataSource = noDataSource.create(config.noDataSource, scope, scope),
                        lookup = config.noLookup,
                        sel = angular.element("<select></select>");

                        sel.addClass("form-control");

                        //sel.attr("ng-model", lookup.ngModel);

                        //sel.attr("ng-options", opts);


                        dataSource.read()
                            .then(function(data){
                                var items = data.paged,
                                    id = noInfoPath.getItem(scope, lookup.ngModel);

                                for(var i in items){
                                    var item = items[i],
                                        o = angular.element("<option></option>"),
                                        v = item[lookup.valueField];

                                    o.attr("value", v);
                                    o.append(item[lookup.textField]);

                                    if(v === id){
                                        o.attr("selected", "selected");
                                    }

                                    sel.append(o);
                                }

                                el.append(sel);


                                el.html($compile(el.contents())(scope));

                                sel.change(function(){
                                    noInfoPath.setItem(scope, lookup.ngModel, angular.element(this).val());
                                });

                                scope.waitingFor[config.scopeKey] = false;
                            })
                            .catch(function(err){
                                scope.waitingForError = {error: err, src: config };
                                console.error(scope.$root.waitingForError);
                            });

				}

				noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope)
					.then(_finish)
					.catch(function(err){
						console.error(err);
					});


            }

            function _compile(el, attrs){
                return _link;
            }

            directive = {
                restrict:"E",
                compile: _compile,
                scope: false
            };

            return directive;
        }])
    ;
})(angular);
