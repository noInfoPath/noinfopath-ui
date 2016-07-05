//file-upload.js
(function (angular, undefined) {

	function NoFileUploadDirective($state, noLocalFileStorage, noFormConfig) {
		function _done(comp, scope, el, blob) {

			noInfoPath.setItem(scope, comp.ngModel, blob);

			scope.$emit("NoFileUpload::dataReady", blob);
			_reset(el);
		}

		function _fault(err) {
			console.error(err);
		}

		function _drop(comp, scope, el, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			try {
				if(e.originalEvent.dataTransfer) {
					var typeNames = e.originalEvent.dataTransfer.types,
						types = {
							files: e.originalEvent.dataTransfer.files,
							items: e.originalEvent.dataTransfer.items
						};
					for(var ti = 0; ti < typeNames.length; ti++) {
						var typeName = typeNames[ti],
							type = types[typeName.toLowerCase()];
						for(var i = 0; i < type.length; i++) {
							var item = type[i];
							noLocalFileStorage.read(item, comp)
								.then(_done.bind(null, comp, scope, el))
								.catch(_fault);
						}
					}

				} else {
					var files = e.originalEvent.srcElement.files;
					for(var fi = 0; fi < files.length; fi++) {
						var file = files[fi];
						noLocalFileStorage.read(file, comp)
							.then(_done.bind(null, comp, scope, el))
							.catch(_fault);
					}
				}
			} catch(err) {
				console.error(err);
			}
			return false;
		}

		function _dragEnterAndOver(scope, el, config, attrs, e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			if(attrs && attrs.noForm) {
				var comp = noInfoPath.getItem(config, attrs.noForm),
					filetype = comp.accept;

				if(filetype && filetype.indexOf(e.originalEvent.dataTransfer.items[0].type) === -1) {
					e.originalEvent.dataTransfer.dropEffect = "none";
					scope.$emit("NoFileUpload::illegalFileType");
				} else {
					e.originalEvent.dataTransfer.dropEffect = "copy";
					scope.$emit("NoFileUpload::legalFileType");
				}
			}
			return false;
		}

		function _dragLeave(e) {
			if(e !== null || e !== undefined) {
				e.stopPropagation();
				e.preventDefault();
			}

			e.originalEvent.dataTransfer.dropEffect = "none";
			return false;
		}

		function _reset(el) {
			var ctrl = el.find("input")[0];

			try {
				ctrl.value = null;
			} catch(ex) {}

			if(ctrl.value) {
				ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
			}
		}

		function _template(el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity),
				comp = noInfoPath.getItem(config, attrs.noForm);

			var accept = comp.accept ? "accept=\"" + comp.accept + "\"" : "",
				ngModel = comp.ngModel ? "{{" + comp.ngModel + ".name || \"Drop File Here\" }}" : "",
				x;

			if(el.is(".no-flex")) {
				x = "<input type=\"file\" class=\"ng-hide\"" + accept + "><div class=\"no-flex\"><button class=\"no-flex\" type=\"button\">Choose a File</button><div class=\"no-flex\">" + ngModel + "</div></div>";

			} else {
				x = "<input type=\"file\" class=\"ng-hide\"" + accept + "><div class=\"input-group\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\">Choose a File</button></span><div class=\"file-list\">" + ngModel + "</div></div>";
			}
			return x;
		}

		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
				comp = noInfoPath.getItem(config, attrs.noForm),
				input = el.find("input"),
				button = el.find("button");

			el.bind("drop", _drop.bind(null, comp, scope, el, attrs));
			el.bind('dragenter', _dragEnterAndOver.bind(null, scope, el, config, attrs));
			el.bind('dragover', _dragEnterAndOver.bind(null, scope, el, config, attrs));
			el.bind('dragleave', _dragLeave);
			$("body")
				.bind("dragenter", _dragLeave);
			$("body")
				.bind("dragover", _dragLeave);
			button.click(function (e) {
				if(input) {
					input.click();
				}
				e.preventDefault();
			});

			input.bind("change", _drop.bind(null, comp, scope, el, attrs));
		}

		return {
			link: _link,
			template: _template,
			restrict: "E"
		};
	}
	angular.module("noinfopath.ui")
		.directive("noFileUpload", ["$state", "noLocalFileStorage", "noFormConfig", NoFileUploadDirective]);
})(angular);
