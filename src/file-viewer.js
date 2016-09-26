//file-viewer.js
(function (angular, /*PDFJS, ODF,*/ undefined) {
	"use strict";

	function NoInfoPathPDFViewerDirective($state, noFormConfig) {
		function renderIframe(el, n) {
			el.html("<iframe src=" + n.blob + " class=\"no-flex stack size-1\">iFrames not supported</iframe>");

		}

		function renderPDF(el, n) {
			PDFJS.getDocument(n.blob)
				.then(function (pdf) {
					el.html("<div class=\"no-flex size-1\" style=\"overflow: auto;\"><canvas/></div>");

					// you can now use *pdf* here
					pdf.getPage(1)
						.then(function (page) {
							var tmp = el.find("canvas"),
								scale = 1.5,
								viewport = page.getViewport(scale),
								canvas = tmp[0],
								context = canvas ? canvas.getContext('2d') : null,
								renderContext;

							if(!context) throw "Canvas is missing";

							canvas.height = viewport.height;
							canvas.width = viewport.width;

							renderContext = {
								canvasContext: context,
								viewport: viewport
							};

							page.render(renderContext);
						});
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
			el.html("<div style=\"\"><img/></div>");

			var img = el.find("img");
			img.attr("src", n.blob);
			img.addClass("full-width");
			//img.css("height", "100%");
		}

		var mimeTypes = {
			"application/pdf": renderPDF,
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": renderODF,
			"image/jpeg": renderImage
		};

		function _link(scope, el, attrs) {
			var config = noFormConfig.getFormByRoute($state.current.name, $state.params.entity, scope),
				comp = noInfoPath.getItem(config, attrs.noForm);

			scope.$watch(comp.ngModel, function (n, o, s) {

				if(n) {
					//console.log(n);
					mimeTypes[n.type.toLowerCase()](el, n);

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
