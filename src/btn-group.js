//btn-group.js
(function(angular, undefined){
    angular.module("noinfopath.ui")

        .directive("noBtnGroup",["$compile", "noConfig", "noDataSource", function($compile, noConfig, noDataSource){
            function _link(scope, el, attrs){
                var config = noInfoPath.getItem(noConfig.current, attrs.noConfig),
                    btnGrp = config.noBtnGroup,
                    dataSource = noDataSource.create(config.noDataSource, scope);

                dataSource.read()
					.then(function(data){
                        var btnGroup = angular.element("<div class=\"btn-group\"></div>"),
                            btnTemplate = "<label></label>";

                        btnGroup.addClass(btnGrp.groupCSS);

                        for(var i=0; i < data.paged.length; i++){
                            var item = data.paged[i],
                                tmpl = angular.element(btnTemplate);


                            tmpl.addClass(btnGrp.itemCSS);
                            tmpl.attr("ng-model", btnGrp.ngModel);
                            tmpl.attr("btn-radio", "'" + item[btnGrp.valueField] + "'");
                            tmpl.text(item[btnGrp.textField]);

                            btnGroup.append(tmpl);
                        }

                        el.append(btnGroup);

                        el.html($compile(el.contents())(scope));

						//scope[config.scopeKey] = data;
					})
                    .catch(function(err){
                        console.error(err);
                    });
            }


            directive = {
                restrict:"EA",
                //scope: {},
                link: _link
            };

            return directive;
        }])
    ;
})(angular);
