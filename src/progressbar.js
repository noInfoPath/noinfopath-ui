//progressbar.js
(function(angular, undefined){
	angular.module("noinfopath.ui")
        .directive("noProgressbar", ['$timeout', 'lodash', function($timeout, _) {

                function progressTracker() {
                    this.message = "Loading";
                    this.current = 0;
                    this.percent = 0;
                    this.max = 0;
                    this.showProgress = true;
                    this.css = "";
                }

                progressTracker.prototype.start = function(options){
                    var def = _.extend({min: 0, max: 0, showProgress: true, css: ""}, options || {} );

                    this.current = def.min;                
                    this.max = def.max;
                    this.showProgress = def.showProgress;   
                    this.css = def.css;
                    this.update(); 
                }

                progressTracker.prototype.update = function(msg) {
                    //console.log(angular.toJson(this));
                    if(this.max > 0){
                        this.percent = this.max == 0 ? 0 : Math.ceil((this.current / this.max) * 100);
                        this.changeMessage(msg || "", this.showProgress);
                        //console.info(this.message, this.current, this.max, this.percent)
                        this.current++;
                    }else{
                        this.percent = 0;
                        this.message = "";
                    }
                }

                progressTracker.prototype.changeMessage = function(msg, showProgress){
                    this.message = msg + (showProgress  ?  " (" + this.percent + "%)" : "");
                }

                progressTracker.prototype.changeCss = function(css){
                    this.css = css;
                }

                var link = function(scope, el, attr, ctrl) {

                    function update() {
                        var p = angular.element(el.children()[0]),
                            m = angular.element(el.children()[1]);

                        p.removeAttr("class");
                        p.addClass("progress-bar " + this.css );
                        p.css("width", this.percent + "%");
                        p.attr("aria-valuenow", this.percent);
                        m.text(this.message);
                    }


                    el.addClass("progress");
                    el.append('<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/><div class="no-progress-message"></div>');

                    scope.$watch(attr.noProgressbar + ".percent", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                                var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));

                    scope.$watch(attr.noProgressbar + ".message", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                               var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));

                    scope.$watch(attr.noProgressbar + ".css", function(newData, oldData, scope) {
                        if (newData) {
                            $timeout(function() {
                                var r = scope.$root || scope;
                                r.$apply(update.bind(this));
                            }.bind(this));
                        }
                    }.bind(scope[attr.noProgressbar]));                
                },
                controller = ['$scope','$element', function($scope, $element) {
                        var noProgressbar = $element.attr("no-progressbar")

                        $scope[noProgressbar] = new progressTracker();
                }],
                directive = {
                    restrict: "A",
                    controller: controller,
                    link: link
                };

                return directive;
        }])
	;

	
	var noInfoPath = {};

	window.noInfoPath = angular.extend(window.noInfoPath || {}, noInfoPath);
})(angular);

