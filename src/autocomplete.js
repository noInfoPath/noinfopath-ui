/*
 *	[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 *
 *	___
 *
 *	[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.59 *
 *
 * [![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)
 *
 *	Copyright (c) 2017 The NoInfoPath Group, LLC.
 *
 *	Licensed under the MIT License. (MIT)
 *
 *	___
 *
 * noAutoComplete Directive
 * ------------------------
 *	<no-auto-complate ng-model="courtLU" placeholder="Find a Court" class="form-control" no-data-source="" />
 */


//autocomplete.js
(function (angular, undefined) {
	function NoAutoCompleteDirective() {
		function _compile(el, attrs) {

			var input = $('<input type="text" uib-typeahead="datum as datum.' + attrs.noTextField +  ' for datum in getData($viewValue)" typeahead-editable="true" typeahead-loading="loading" typeahead-no-results="noResults" typeahead-input-formatter="formatter()" typeahead-min-length="3">'),
				loading = $('<i ng-show="loading" class="glyphicon glyphicon-refresh"></i>'),
				noResults = $('<div ng-show="noResults"><i class="glyphicon glyphicon-remove"></i>No Results Found</div>');

			input.attr("ng-model", attrs.ngModel);
			input.attr("placeholder", attrs.placeholder);
			//if(attrs.required) input.attr("required", "");
			input.css("width", "100%");
			input.css("height", "100%");



			el.addClass("no-p-a-z");
			//el.removeAttr("ng-model");

			el.append(input);
			el.append(loading);
			el.append(noResults);

			return _link;
		}

		function _link(scope, el, attrs) {
			if(!attrs.noDataSource) throw "Need to supply a no-data-source attribute. (i.e. noHTTP_SOPDB.courts)";
			if(!attrs.noTextField) throw "Need to supply a no-text-field attribute.";

			var unWatch_ngModel = scope.$watch(attrs.ngModel, function(n, o, s){
				s.$parent[attrs.noModel] = n;
			});

			var unWatch_noResults = scope.$watch("noResults", function(n, o, s){
				if(n) {
					s.noResults = false;
					s[attrs.noModel] = s[attrs.noModel];
				}
			});

			scope.getData = function(value) {
				var ds = noInfoPath.getItem(scope, attrs.noDataSource),
					filters = new noInfoPath.data.NoFilters();
				filters.quickAdd(attrs.noTextField, "contains", value);
				return ds.noRead(filters)
					.then(function(results){
						return results;
					})
					.catch(function(err){
						if(err.status !== 404) console.error(err);
						return err;
					});

			};

			scope.formatter = function(a) {
				var tmp = noInfoPath.getItem(scope, attrs.ngModel),
					text = noInfoPath.getItem(tmp, attrs.noTextField);

				return text;
			};

			// scope.noResults = function(e){
			// 	console.log(e);
			// 	scope[attrs.ngModel] = {};
			// 	return false;
			// };

			scope.$on("$destroy", function(){
				unWatch_ngModel();
			});
		}

		return {
			restrict: "E",
			scope: true,
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		.directive("noAutoComplete", [NoAutoCompleteDirective])
		;
})(angular);
