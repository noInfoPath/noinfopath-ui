//notify.js
(function(angular, undefined) {
	"use strict";
	function startup($rootScope) {
		$(window.top.document.body).append("<no-notifications></no-notifications>");
	}

	function NoNotificationService($interval, $rootScope) {
		var tpl = "<no-notification class=\"alert\" role=\"alert\"></no-notification>",
			xtmp = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>",
			alertTypes = {
				"warning": "alert-warning",
				"info": "alert-info",
				"danger": "alert-danger",
				"success": "alert-success"
			},
			dismissible = "alert-dismissible",
			timeout = 100,
			defaultOptions = {
				ttl: 1, //in seconds
				dismissible: false,
				type: "info"
			},
			container = $("no-notifications");

		function _appendMessage(message, options) {
			var tmpOptions = angular.extend({}, defaultOptions, options),
				notifcation = $(tpl),
				btn = $(xtmp);

			notifcation.addClass(alertTypes[tmpOptions.type]);

			if(tmpOptions.dismissible) {
				notifcation.append(btn);
				notifcation.attr("ttl", -1);
				notifcation.attr("age", 0);
				notifcation.addClass(dismissible);
			} else {
				notifcation.attr("ttl", tmpOptions.ttl);
				notifcation.attr("age", 0);
			}

			notifcation.append(message);

			container.prepend(notifcation);

			if(tmpOptions.dismissible) btn.click(removeMessage.bind(null, notifcation));
		}
		this.appendMessage = _appendMessage;

		function removeMessage(el) {
			el.remove();
		}

		function ageAndPurgeMessages() {
			var messages = container.children();

			for(var m=0; m < messages.length; m++) {
				var el = $(messages[m]),
					ttl = Number(el.attr("ttl")),
					age = Number(el.attr("age"));

				if(ttl > -1) {
					if(age >= ttl) {
						el.remove();
					} else {
						el.attr("age", age + 1);
					}
				}
			}
		}

		$interval(ageAndPurgeMessages, timeout);

	}

	angular.module("noinfopath.ui")
		.run(["$rootScope", startup])
		.service("noNotificationService", ["$interval", "$rootScope", NoNotificationService])
	;
})(angular);
