//file-viewer.js
(function (angular, /*PDFJS, ODF,*/ undefined) {
	"use strict";

	function NoInfoPathPDFViewerDirective($state, noFormConfig) {
		function removeViewerContainer(el){
			el.find(".no-file-viewer").remove();
		}

		function renderIframe(el, n) {
			el.append("<iframe src=" + n.blob + " class=\"no-file-viewer no-flex-item size-1\">iFrames not supported</iframe>");

		}

		function renderPDF(el, n) {
			var tmp = $("<div class=\"no-file-viewer no-flex no-flex-item size-1\" style=\"overflow: auto;\"></div>");
			el.append(tmp);
			PDFObject.embed(n.blob, tmp, {height: "auto", width: "auto"});
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
			el.append("<div class=\"no-file-viewer no-flex-item size-1\" style=\"overflow: auto;\"><img/></div>");

			var img = el.find("img");
			img.attr("src", n.blob);
			//img.addClass("full-width");
			img.css("height", "100%");
			img.css("width", "100%");
		}

		var mimeTypes = {
			"application/pdf": renderPDF,
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
			"image": renderImage,
			"text/plain": renderIframe,
			"text/html": renderIframe
		};

		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
				comp = noInfoPath.getItem(config, attrs.noForm);

			scope.$watch(comp.ngModel, function (n, o, s) {

				if(n) {
					//console.log(n);
					var mime = n.type.toLowerCase().split("/");

					if(mime[0] === "image") {
						mime = mime[0];
					}else{
						mime = n.type;
					}
					removeViewerContainer(el);
					mimeTypes[mime](el, n);

					// renderIframe(el, n);
				}

			});

			// el.text("Hello World");
			// PDFJS.getDocument('helloworld.pdf')
			// 	.then(function(pdf) {
			// 	  // you can now use *pdf* here
			// 	});
			// scope.$on("NoFileUpload::illegalFileType", function(e) {
			// 	console.log("this file type can't be dropped here");
			// });
			//
			// scope.$on("NoFileUpload::dataReady", function(e, fileInfo) {


			//});
		}

		return {
			restrict: "E",
			link: _link
		};
	}

	angular.module("noinfopath.ui")
		.directive("noPdfViewer", ["$state", "noFormConfig", NoInfoPathPDFViewerDirective]);
})(angular /*, PDFJS, odf experimental code dependencies*/ );
