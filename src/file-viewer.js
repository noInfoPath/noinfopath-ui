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

		if(!!c) c = el;

		img.attr("src", n.url || n.blob);
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

	function render(el, n, msg) {

		$(el).empty();

		switch(n) {
			case "FILE_NOT_FOUND":
				el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '>" + (msg || "File Not Found") + "</h3></div>");
				break;
			case "LOADING":
				el.html("<div class='flex-center flex-middle no-flex no-flex-item size-1 vertical'><h3 class='no-flex-item '><div class='progress'><div class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div></h3></div>");
				break;
			default:
				var type = n.fileObj ? n.fileObj.type : n.type,
					mime = type.toLowerCase().split("/");

				if(mime[0] === "image") {
					mime = mime[0];
				} else {
					mime = type;
				}
				//removeViewerContainer(el);
				if(msg) {
					renderImage(el, n);
				} else {
					mimeTypes[mime](el, n);
				}
				break;

		}

	}

	function NoFileViewer2Directive($compile, $state, $timeout, noLocalFileSystem) {
		function _clear(el) {
			$(".no-file-viewer",el).empty();
		}

		function _read(el, fileId, notFoundMessage) {
			if(fileId) {
				render(el, "LOADING");
				return noLocalFileSystem.getUrl(fileId)
					.then(function(file){
						if(!!file) {
							render(el, file, notFoundMessage);
						} else {
							render(el, "FILE_NOT_FOUND");
						}
					})
					.catch(function(err){
						console.error(err);
					});
			} else {
				render(el, "FILE_NOT_FOUND", notFoundMessage);
			}

		}

		function _compile(el, attrs) {

			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {
				scope.noFileViewer = {
					refresh: _read.bind(null, el)
				};

				if(attrs.url) {
					if(!attrs.type) throw "noFileViewer directive requires a type attribute when the url attribute is provided";
					render(el, {type: attrs.type, blob: attrs.url});
				} else if(attrs.fileId) {
					if(noInfoPath.isGuid(attrs.fileId)) {
						_read(el, attrs.fileId, !!attrs.showAsImage);
					} else {
						scope.$watch(attrs.waitFor, function(key, msg, n, o){
							//console.info("file-viewer watch: ", n, o);
							//if(n && noInfoPath.isGuid(n.ID)) {
							if(n) {
								//scope.noFileViewer.fileId = noInfoPath.getItem(n, key);
								_read(el, noInfoPath.getItem(n, key), msg);
								// if(scope.noFileViewer.fileId) {
								// } else {
								// 	render(el, "FILE_NOT_FOUND");
								// }
							} else {
								_clear();
							}
						}.bind(null, attrs.fileId, attrs.notFoundMessage));

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
						if(n && n.FileID) _read(el, n.FileID);
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
		//.directive("noPdfViewer", ["$state", "noFormConfig", NoInfoPathPDFViewerDirective])
		.directive("noFileViewer", ["$compile", "$state", "$timeout", "noLocalFileSystem", NoFileViewer2Directive])
	;
})(angular /*, PDFJS, odf experimental code dependencies*/ );
