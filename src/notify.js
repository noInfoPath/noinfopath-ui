/*
 * ## noNotificationService
 *
 * Has the ability to create notifications in the DOM with a message and specific options.
 *
 * ### Sample Usage
 *
 * This sample show how to use the noNotificationService
 * service in your code.
 *
 * ```js
 * noNotificationService.appendMessage("Hello World", {id: "jawnjawnjawn"});
 * ```
 *
 * ### Sample Options
 *
 * ```js
 * {
 *     ttl: 1000, // Time to live in milliseconds
 *     dismissible: false, // If true, message will be stuck until dismissed
 *     type: "info" // A specific type that connects to bootstrap classes. Can be warning, info, danger, or success
 * }
 * ```
 * | Option Name | Description                                                                                                         |
 * |-------------|---------------------------------------------------------------------------------------------------------------------|
 * | ttl         | This is the time to live. It defaults to `1000` ms (1 second).                                                        |
 * | dismissable | This is default to `false`. If set to true, the notification will have an "x" and stay on the screen until dismissed. |
 * | type        | This corresponds to the bootstrap classes. Possible values are `warning`, `info`, `danger`, or `success`. Default is `info`.  |
 * | classes          | An array of CSS classes to add onto the notification                                   |
 * | id          | A specific id can be given so the same message cannot be shown repeatedly.                                    |
 *
 * ### How it Works
 * When append message is called, an element is appended to the DOM, off the `<no-notifications>` element.
 * It uses CSS defined in `_notification.scss`. `$interval` is used to update the `age` property on the element.
 * When the `age` is greater than the `ttl` defined in the options, the element is removed.
 */


//notify.js
(function(angular, undefined) {
    "use strict";

    function startup($rootScope) {
        $(window.top.document.body).append("<no-notifications></no-notifications>");
    }

    function NoNotificationService($interval, $rootScope) {
        var ids = [];

        var tpl = "<no-notification class=\"alert fadeIn\" role=\"alert\"></no-notification>",
            xtmp = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>",
            alertTypes = {
                "warning": "alert-warning",
                "info": "alert-info",
                "danger": "alert-danger",
                "success": "alert-success"
            },
            dismissible = "alert-dismissible",
            timeout = 1000,
            defaultOptions = {
                ttl: 1000, //in milliseconds
                dismissible: false,
                type: "info",
                classes: []
            },
            container = $("no-notifications");

        function _appendMessage(message, options) {
            var tmpOptions = angular.extend({}, defaultOptions, options),
                notifcation = $(tpl),
                btn = $(xtmp),
                classes = [alertTypes[tmpOptions.type]].concat(tmpOptions.classes);

            if (!tmpOptions.id) tmpOptions.id = noInfoPath.createUUID();

            if (ids.indexOf(tmpOptions.id) > -1) {
                return false;
            } else {
                ids.push(tmpOptions.id);
            }

            notifcation.addClass(classes.join(" "));
            notifcation.attr("message-id", tmpOptions.id);


            if (tmpOptions.dismissible) {
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

            if (tmpOptions.dismissible) btn.click(removeMessage.bind(null, notifcation));
        }
        this.appendMessage = _appendMessage;

        function removeMessage(el) {
            var messageId = el.attr("message-id"),
                messageIdNdx = ids.indexOf(messageId);

            ids.splice(messageIdNdx, 1);

            el.animate({
                opacity: 0,
                "padding-top": 0,
                "padding-bottom": 0,
                height: 0
            }, '200', function() {
                el.remove();
            });
        }

        function ageAndPurgeMessages() {
            var messages = container.children();

            for (var m = 0; m < messages.length; m++) {
                var el = $(messages[m]),
                    ttl = Number(el.attr("ttl")),
                    age = Number(el.attr("age"));

                if (ttl > -1) {
                    if (age >= ttl) {
                        removeMessage(el);
                        break;
                    } else {
                        el.attr("age", age + 1000);
                    }
                }
            }
        }

        $interval(ageAndPurgeMessages, timeout);
    }

    angular.module("noinfopath.ui")
        .run(["$rootScope", startup])
        .service("noNotificationService", ["$interval", "$rootScope", NoNotificationService]);
})(angular);
