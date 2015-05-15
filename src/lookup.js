//lookup.js
(function(angular, undefined){
    angular.module("noinfopath.ui")
        .directive("noLookup",[ "$compile", "noSessionStorage", function($compile, noSessionStorage){
            var link = function(scope, el, attrs){
                function _buildLookUp(){
                    var sel = angular.element("<select></select>");

                    sel.addClass("form-control");
                    sel.attr("ng-model", attrs.model);

                    var opts = "cat." + attrs.textField + " for cat in " + attrs.listSource + " | orderBy : '" + attrs.orderBy + "' track by cat." + attrs.valueField;

                    sel.attr("ng-options", opts);

                    el.append(sel);
                }       

                _buildLookUp(); 

                if(attrs.listLocation){
                    scope[attrs.listSource] = noSessionStorage.getItem(attrs.listSource);
                }

                // if(attrs.pmlcFilterkey)
                // {
                //         scope.$parent.pmlcFilterKeys = angular.isArray(scope.$parent.pmlcFilterKeys) ? scope.$parent.pmlcFilterKeys : [];
                //         scope.$parent.pmlcFilterKeys.push(attrs.pmlcFilterkey);

                // }

                $compile(el.contents())(scope);                 
            },

            directive = {
                restrict:"E",
                //scope: {},
                link:link
            }

            return directive;
        }])
    ;
})(angular);