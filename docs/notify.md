## noNotificationService

Has the ability to create notifications in the DOM with a message and specific options.

### Sample Usage

This sample show how to use the noNotificationService
service in your code.

```js
noNotificationService.appendMessage("Hello World", {id: "jawnjawnjawn"});
```

### Sample Options

```js
{
    ttl: 1000, // Time to live in milliseconds
    dismissible: false, // If true, message will be stuck until dismissed
    type: "info" // A specific type that connects to bootstrap classes. Can be warning, info, danger, or success
}
```
| Option Name | Description                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------|
| ttl         | This is the time to live. It defaults to `1000` ms (1 second).                                                        |
| dismissable | This is default to `false`. If set to true, the notification will have an "x" and stay on the screen until dismissed. |
| type        | This corresponds to the bootstrap classes. Possible values are `warning`, `info`, `danger`, or `success`. Default is `info`.  |
| classes          | An array of CSS classes to add onto the notification                                   |
| id          | A specific id can be given so the same message cannot be shown repeatedly.                                    |

### How it Works
When append message is called, an element is appended to the DOM, off the `<no-notifications>` element.
It uses CSS defined in `_notification.scss`. `$interval` is used to update the `age` property on the element.
When the `age` is greater than the `ttl` defined in the options, the element is removed.

