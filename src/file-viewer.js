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
		console.log("no-file-viewer::renderIframe3", n, el);

		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + (n.url || n.blob) + "\">iFrames not supported</iframe>");

		el.html(iframe[0].outerHTML);
	}

	function renderIframe4(el, u) {
		el.addClass("flex-stretch");
		var iframe = $("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + u + "\">iFrames not supported</iframe>");

		el.html(iframe[0].outerHTML);
	}

	function renderImage4(el, u) {
		el.addClass("flex-center");
		var iframe = $("<img class=\"no-file-viewer no-flex-item\" src=\"" + u + "\"/>");
		el.html(iframe[0].outerHTML);
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


	var mimeTypes = {
		"application/pdf": renderIframe3,
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
		"image": renderIframe3,
		"text/plain": renderIframe3,
		"text/html": renderIframe3
	};


	function NoFileViewer2Directive($compile, $state, $timeout, noLocalFileSystem, noMimeTypes) {

		function _render(el, n, msg) {

			$(el).empty();

			switch(n) {
				case "FILE_NOT_FOUND":
					el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '>" + (msg || "File Not Found") + "</h3></div>");
					break;
				case "LOADING":
					el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '><div class='progress'><div class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div></h3></div>");
					break;
				default:
					var url, type;

					if(n.fileEntry) {
						type = n.fileObj.type;
						url = n.fileEntry.toURL();
					} else if(n.blob) {
						type = n.type;
						url = n.blob;
					}

					//removeViewerContainer(el);

					try{
						if(angular.isString(n)) {
							el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '>" + (n || "File Not Found") + "</h3></div>");
						} else {
							if(noMimeTypes.isImage(n.fileObj ? n.fileObj.type : n.type)) {
								renderImage4(el, url);
							} else {
								renderIframe4(el, url);
							}
						}
					} catch(err) {
						console.error(err);
					}

					break;

			}

		}

		function _clear(el) {
			$(".no-file-viewer",el).empty();
		}

		function _read(el, fileId, notFoundMessage) {
			if(fileId) {
				render(el, "LOADING");
				return noLocalFileSystem.getUrl(fileId)
					.then(function(file){
						if(!!file) {
							_render(el, file);
						} else {
							_render(el, "FILE_NOT_FOUND", notFoundMessage);
						}
					})
					.catch(function(err){
						console.error(err);
					});
			} else {
				_render(el, "FILE_NOT_FOUND", notFoundMessage);
			}

		}

		function _compile(el, attrs) {

			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {
				var unWatch;

				scope.noFileViewer = {
					refresh: _read.bind(null, el)
				};

				if(attrs.url) {
					if(!attrs.type) throw "noFileViewer directive requires a type attribute when the url attribute is provided";
					_render(el, {type: attrs.type, blob: attrs.url});
				} else if(attrs.fileId) {

					if(noInfoPath.isGuid(attrs.fileId)) {
						_render(el, "LOADING");
						noLocalFileSystem.read({fileId: attrs.fileId, type: attrs.type}, "fileId")
							.then(function(result){
								_render(el, result);
							})
							.catch(function(err){
								_render(el, attrs.notFoundMessage || "FILE_NOT_FOUND");
							});
						//render(el, noLocalFileSystem.getUrl(attrs.fileId), !!attrs.showAsImage);
					} else {
						unWatch = scope.$watch(attrs.waitFor, function(key, msg, n, o){
							//console.info("file-viewer watch: ", n, o);
							//if(n && noInfoPath.isGuid(n.ID)) {
							if(n) {

								noLocalFileSystem.read({fileId: noInfoPath.getItem(n, attrs.fileId), type: noInfoPath.getItem(n, attrs.type)}, "fileId")
									.then(function(result){
										_render(el, result);
									})
									.catch(function(err){
										_render(el, attrs.notFoundMessage || "FILE_NOT_FOUND");
									});
							} else {
								_clear();
							}
						}.bind(null, attrs.fileId, attrs.notFoundMessage));
					}
				}else{
					// unWatch = scope.$watch(attrs.waitFor, function(n, o){
					// 	if(n) {
					// 		noLocalFileSystem.read({fileId: n, type: attrs.type}, "fileId")
					// 			.then(function(result){
					// 				render(el, result);
					// 			});
					// 	}
					// });

					console.warn("Possible dead code area.");
				}

				scope.$on("$destroy", function() {
					if(unWatch) {
						unWatch();
						unWatch = null;
					}
				});

			};

		}

		return {
			restrict: "E",
			compile: _compile
		};
	}

	angular.module("noinfopath.ui")
		//.directive("noPdfViewer", ["$state", "noFormConfig", NoInfoPathPDFViewerDirective])
		.directive("noFileViewer", ["$compile", "$state", "$timeout", "noLocalFileSystem", "noMimeTypes", NoFileViewer2Directive])
	;
})(angular /*, PDFJS, odf experimental code dependencies*/ );