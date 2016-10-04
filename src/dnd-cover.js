(function (angular) {
	function NoDnDCoverDirective() {
		var oldAddEventListener = EventTarget.prototype.addEventListener;

		EventTarget.prototype.addEventListener = function (eventName, eventHandler) {
			oldAddEventListener.call(this, eventName, function (event) {
				//if(!$preventAllEvents.is(':checked'))
					eventHandler(event);
			});
		};
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

		return {
			"restrict": "E",
			"link": function (scope, el, attrs) {
				//must have a parent
				console.log(el.parent());
				el.css("position", "absolute");
				el.css("top", "0");
				el.css("bottom", "0");
				el.css("left", "0");
				el.css("right", "0");
				el.css("background-color", "rgba(0, 0, 0, 0.51)");
				el.css("z-index", "100");
				el.css("display", "none");

				el.parent().bind("drop", _drop.bind(null, {}, scope, el, attrs));
				el.parent().bind('dragenter', _dragEnterAndOver.bind(null, scope, el, {}, attrs));
				el.parent().bind('dragover', _dragEnterAndOver.bind(null, scope, el, {}, attrs));
				el.parent().bind('dragleave', _dragLeave);
				$("body")
					.bind("dragenter", _dragLeave);
				$("body")
					.bind("dragover", _dragLeave);

			}
		};
	}

	angular.module("noinfopath.ui")
		.directive("noDndCover", [NoDnDCoverDirective]);
})(angular);
