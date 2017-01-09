//file-viewer.js
(function (angular, /*PDFJS, ODF,*/ undefined) {
	"use strict";


	function removeViewerContainer(el) {
		el.find(".no-file-viewer").remove();
	}

	function renderIframe(el, n) {
		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + n.blob + "\">iFrames not supported</iframe>");

		el.find(".no-file-viewer").html(iframe);
	}
	function renderIframe3(el, n) {
		//console.log(n);
		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + (n.url || n.blob) + "\">iFrames not supported</iframe>");

		el.find(".no-file-viewer").html(iframe);
	}
	function renderIframe2(el, n) {
		var iframe = el.append("<iframe class=\"no-file-viewer no-flex-item size-1\">iFrames not supported</iframe>"),
			url = window.URL || window.webkitURL,
			blob =  new Blob([n.blob], {type: n.type});

		iframe.src = url.createObjectURL(blob);
	}

	function renderPDF(el, n) {
		// var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");
		//el.append(tmp);
		PDFObject.embed(n.blob, $(".no-file-viewer",el), {
			height: "auto",
			width: "auto"
		});

	}

	function renderODF(el, n) {
		el.html("<div style=\"position: fixed; left:0; right: 0; top: 300px; bottom: 100px; overflow: scroll;\"><div class=\"canvas\"></div></div>");

		var odfelement = el.find(".canvas")[0],
			odfCanvas = new odf.OdfCanvas(odfelement);

		odfCanvas.load(n.blob);
		// 	= new odf.OdfContainer(n.type, function(e){
		//    	//console.log(e);
		//    	odfCanvas.setOdfContainer(e);
		//    	odfContainer.setBlob(n.name, n.type, n.blob.split(";")[1].split(",")[1]);
		//
		//    });

	}

	function renderImage(el, n) {


		var c = el.find(".no-file-viewer"),
			img = angular.element("<img>");

		img.attr("src", n.blob);
		//img.addClass("full-width");
		img.css("height", "100%");
		img.css("width", "100%");

		c.html(img);
	}

	var mimeTypes = {
		"application/pdf": renderIframe3,
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
		"image": renderIframe3,
		"text/plain": renderIframe3,
		"text/html": renderIframe3
	};

	function render(el, n) {
		if(n === "FILE_NOT_FOUND") {
			el.html("<div class='no-flex'><div class='no-flex-item'><h3>File Not Found</h3></div></div>");
		} else {
			var type = n.fileObj ? n.fileObj.type : n.type,
				mime = type.toLowerCase().split("/");

			if(mime[0] === "image") {
				mime = mime[0];
			} else {
				mime = type;
			}
			//removeViewerContainer(el);
			mimeTypes[mime](el, n);
		}
	}

	function NoInfoPathPDFViewerDirective($state, noFormConfig) {

		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
				comp = noInfoPath.getItem(config, attrs.noForm);

			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			scope.$watch(comp.ngModel, function (n, o, s) {

				if(n) {
					render(el, n);
				}

			});

		}

		return {
			restrict: "E",
			link: _link
		};
	}

	function NoFileViewerDirective($compile, $state, $timeout, noLocalFileStorage) {
		function _cleanUp(url) {
			var revoke = window.URL.revokeObjectURL || window.webkitURL.revokeObjectURL;

			$timeout(function(){
				revoke(url);
			},1000);
		}

		function _clear(el) {
			$(".no-file-viewer",el).empty();
		}

		function _read(fileId, el) {

			return noLocalFileStorage.get(fileId)
				.then(function(file){
					render(el, file);
					_cleanUp(file.blob);
				})
				.catch(function(err){
					console.error(err);
				});
		}

		function _compile(el, attrs) {
			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {


				if(attrs.url) {
					render(el, {type: attrs.type, blob: attrs.url});
					if(attrs.url.indexOf("data:") > -1) cleanUp(attrs.url)
				} else if(attrs.fileId) {
					if(noInfoPath.isGuid(attrs.fileId)) {
						_read(attrs.fileId, el)
					} else {
						scope.$watch(attrs.waitFor, function(n, o){
							//console.info("file-viewer watch: ", n, o);
							if(n && noInfoPath.isGuid(n.ID)) {
								var fid = noInfoPath.getItem(n, attrs.fileId);
								_read(fid, el);
							} else {
								_clear();
							}
						});

						// scope.$watchCollection(attrs.waitFor, function(n, o){
						// 	//console.info("file-viewer watchCollection: ", n, o);
						// 	if(n && noInfoPath.isGuid(n.ID)) {
						// 		var fid = noInfoPath.getItem(n, attrs.fileId);
						// 		_read(fid, el);
						// 	} else {
						// 		_clear();
						// 	}
						// });
					}
				}else{
					scope.$watch(attrs.waitFor, function(n, o){
						if(n && n.FileID) _read(n.FileID, el);
					});
				}


			};

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	function NoFileViewer2Directive($compile, $state, $timeout, noLocalFileSystem) {
		function _clear(el) {
			$(".no-file-viewer",el).empty();
		}

		function _read(fileId, el) {

			return noLocalFileSystem.getUrl(fileId)
				.then(function(file){
					if(!!file) {
						render(el, file);
					} else {
						render(el, "FILE_NOT_FOUND")
					}
				})
				.catch(function(err){
					console.error(err);
				});
		}

		function _compile(el, attrs) {
			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {
				if(attrs.url) {
					if(!attrs.type) throw "noFileViewer directive requires a type attribute when the url attribute is provided"
					render(el, {type: attrs.type, blob: attrs.url});
				} else if(attrs.fileId) {
					if(noInfoPath.isGuid(attrs.fileId)) {
						render(el, noLocalFileSystem.getUrl(attrs.fileId));
					} else {
						scope.$watch(attrs.waitFor, function(n, o){
							//console.info("file-viewer watch: ", n, o);
							if(n && noInfoPath.isGuid(n.ID)) {
								var fid = noInfoPath.getItem(n, attrs.fileId);
								_read(fid, el);
							} else {
								_clear();
							}
						});

						// scope.$watchCollection(attrs.waitFor, function(n, o){
						// 	//console.info("file-viewer watchCollection: ", n, o);
						// 	if(n && noInfoPath.isGuid(n.ID)) {
						// 		var fid = noInfoPath.getItem(n, attrs.fileId);
						// 		_read(fid, el);
						// 	} else {
						// 		_clear();
						// 	}
						// });
					}
				}else{
					scope.$watch(attrs.waitFor, function(n, o){
						if(n && n.FileID) _read(n.FileID, el);
					});
				}


			};

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		.directive("noPdfViewer", ["$state", "noFormConfig", NoInfoPathPDFViewerDirective])
		.directive("noFileViewer", ["$compile", "$state", "$timeout", "noLocalFileSystem", NoFileViewer2Directive])
		.directive("noImg", [function(){
			return {
				restrict: "E",
				compile: function(el, attrs) {

					return function(scope, el, attrs) {
						console.log(attrs.url);
						el.html("<img src=\"" + attrs.url + "\" style=\"width: 7in; height: 100%\">")
					}
				}
			};
		}]);
})(angular /*, PDFJS, odf experimental code dependencies*/ );
