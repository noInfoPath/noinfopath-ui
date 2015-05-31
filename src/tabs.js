//tabs.js
(function(angular){
    angular.module("noinfopath.ui")
        .directive("noTabs",[ "$compile", function($compile){
            var link = function(scope, el, attrs){
                var lis = el.find("li"),
                    pnls = el.find("no-tab-panels").children(),
                    def = el.find("li.active"), defNdx;

                pnls.addClass("ng-hide");

                angular.forEach(lis, function(li, ndx){
                    angular.element(li).attr("ndx", ndx);
                    //console.log(ndx, li);
                })

                lis.click(function(e){
                    e.preventDefault();

                    var tab = el.find("li.active"),
                        pnlNdx = Number(tab.attr("ndx")),
                        pnl = angular.element(pnls[pnlNdx]);

                    tab.toggleClass("active");
                    pnl.toggleClass("ng-hide");

                    tab = angular.element(e.target).closest("li");
                    pnlNdx = Number(tab.attr("ndx"))
                    pnl = angular.element(pnls[pnlNdx]);
                    
                    tab.toggleClass("active");
                    pnl.toggleClass("ng-hide");

                    //console.log()
                });

                //$compile(el.contents())(scope);                 

                //Show defaul tab panel
                defNdx = Number(def.attr("ndx"));
                angular.element(pnls[defNdx]).toggleClass("ng-hide");

            },

            directive = {
                restrict:"E",
                link:link
            }

            return directive;
        }])

    ;
})(angular);
