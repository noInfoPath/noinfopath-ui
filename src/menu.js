//menu.js
(function(angular, undefined){
    function menuItem(){
        if(arguments.length == 1 && angular.isObject(arguments[0])){
            this.title = arguments[0].title;
            this.state = arguments[0].state;
            this.glyph = arguments[0].glyph;
            this.children = [];
        }else if(arguments.length > 1){
            this.title = arguments[0];
            this.state = arguments[1];
            this.children = arguments.length == 3 ? arguments[2] : [];
        }else{
            this.title = "";
            this.state = "";
            this.children = [];
        }
    }

    function _buildMenuItem(menuItem, el){
        if(menuItem.title){
            var li = angular.element("<li></li>"),
                a = angular.element("<a></a>");

            a.text(menuItem.title);
            li.append(a);
            el.append(li);

            if(menuItem.glyph){
                a.append(menuItem.glyph);
            }

            if(menuItem.state){
                a.attr("ui-sref", menuItem.state);

            }else{
                li.attr("dropdown","");
                li.addClass("dropdown");
                a.attr("href", "#");
                a.attr("dropdown-toggle","");
                a.addClass("dropdown-toggle");

                if(menuItem.children.length){
                    var ul = angular.element("<ul class=\"dropdown-menu\" role=\"menu\"></ul>");
                    li.append(ul);
                    angular.forEach(menuItem.children, function(childMenu){
                        _buildMenuItem(childMenu,ul);
                    });
                }
            }
        }else{
            if(menuItem.children.length){
                angular.forEach(menuItem.children, function(childMenu){
                    _buildMenuItem(childMenu,el);
                });
            }
        }
    }

    angular.module("noinfopath.ui")
        .directive("noAreaMenu", ["noArea", "$compile", "lodash", function(noArea, $compile, _){
            var directive = {
                restrict: "A",
                transclude: true,
                link: function(scope, el, attrs){
                    noArea.whenReady()
                        .then(function(){
                            _buildMenuItem(new menuItem("","",noArea.menuConfig), el);
                            $compile(el.contents())(scope);
                        });
                }
            };

            return directive;
        }])
    ;

})(angular);
