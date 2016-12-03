//file-viewer.js
(function (angular, /*PDFJS, ODF,*/ undefined) {
	"use strict";


	function removeViewerContainer(el) {
		el.find(".no-file-viewer").remove();
	}

	function renderIframe(el, n) {
		var iframe = el.append("<iframe class=\"no-file-viewer no-flex-item size-1\" src=\"" + n.blob + "\">iFrames not supported</iframe>");
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
		PDFObject.embed(n.blob, ".no-file-viewer", {
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
		"application/pdf": renderPDF,
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
		"image": renderImage,
		"text/plain": renderIframe,
		"text/html": renderIframe
	};

	function render(el, n) {
		var mime = n.type.toLowerCase().split("/");

		if(mime[0] === "image") {
			mime = mime[0];
		} else {
			mime = n.type;
		}
		//removeViewerContainer(el);
		mimeTypes[mime](el, n);


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

		function _compile(el, attrs) {
			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");

			el.html(tmp);

			return function(scope, el, attrs) {
				if(attrs.url) {
					render(el, {type: attrs.type, blob: attrs.url});
					if(attrs.url.indexOf("data") > -1) URL.revokeObjectURL(file.url);
				} else if(attrs.fileId) {
					noLocalFileStorage.get(attrs.fileId)
						.then(function(file){
							render(el, file);
							URL.revokeObjectURL(file.blob);
						})
						.catch(function(err){
							console.error(err);
						});
				}else{
					scope.$watch(attrs.waitFor, function(n, o){
						//el.empty();

						if(n && n.FileID){
							noLocalFileStorage.get(n.FileID)
								.then(function(file){
									render(el, file);
									URL.revokeObjectURL(file.blob);
								})
								.catch(function(err){
									console.error(err);
								});
						}

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
		.directive("noFileViewer", ["$compile", "$state", "$timeout", "noLocalFileStorage", NoFileViewerDirective]);
})(angular /*, PDFJS, odf experimental code dependencies*/ );
