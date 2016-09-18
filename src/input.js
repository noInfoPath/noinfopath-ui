//input.js
(function(angular, undefined) {
	/*
	 * <div class="no-ctrl-group" noid="NOIDbe97eec4fd53452ba72be0281d83bbad" dnd-list="" dnd-drop="">
	 * 	<label>Label</label>
	 * 	<control>
	 * 		<input class="form-control">
	 * 	</control>
	 * </div>
	 */
	function NoInputDirective(noNCLManager, $stateParams, $state) {
		function _compile(el, attrs) {
			var noid = el.parent().parent().attr("noid"),
				hashStore = noNCLManager.getHashStore($stateParams.fid || $state.current.name.split(".").pop()),
				ncl = hashStore.get(noid),
				noComponent = ncl.noComponent,
				cfg = ncl.noElement,
				input = angular.element("<input class=\"form-control\" ng-model=\""+ $stateParams.fid + "." + noComponent.ngModel +"\"></input>");
				//TODO reformat/make data source designer
			if(cfg.validators) {
				if(cfg.validators.required) input.attr("required", true);
			}

			el.append(input);

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")

	.directive("noInput", ["noNCLManager", "$stateParams", "$state", NoInputDirective])
	;

})(angular);
