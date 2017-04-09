//btn-group.js
(function(angular, undefined) {
	/**
	*	### NoCheckboxDirective
	*
	*	Extands a standard checkbox element to support noActionQueue configurations
	*	that are store in `area.json` files.
	*
	*
	*	#### Configuration
	*
	*	```json
	*
	*	{
	*		myButtonConfig: {
				"actions": [
	*				{
	*					"provider": "$state",
	*					"method": "go",
	*					"noContextParams": true,
	*					"params": [
	*						"efr.project.search",
	*						{
	*							"provider": "noStateHelper",
	*							"method": "makeStateParams",
	*							"params": [
	*								{
	*									"key": "id",
	*									"provider": "scope",
	*									"property": "document.ProjectID.ID"
	*								}
	*							],
	*							"passLocalScope": true
	*						}
	*					]
	*				}
	*			]
	*		}
	*	}
	*
	*	```
	*
	*/
	function NoCheckboxDirective($state, noFormConfig, noActionQueue){


		function _link(scope, el, attrs) {
			var ctx = noFormConfig.getComponentContextByRoute($state.current.name, $state.params.entity, "noCheckbox", attrs.noForm);

			el.click(function (e) {
				//e.preventDefault();

				// var execQueue = noActionQueue.createQueue(ctx, scope, el, ctx.component.actions);
				//
				// return noActionQueue.synchronize(execQueue)
				// 	.then(function (results) {
				// 		//console.log(results);
				// 	})
				// 	.catch(function (err) {
				// 		throw err;
				// 	});

			});
		}

		return {
			restrict: "A",
			link: _link
		};

	}

	angular.module("noinfopath.ui")
		.directive("noCheckbox", ["$state", "noFormConfig", "noActionQueue", NoCheckboxDirective])
	;
})(angular);
