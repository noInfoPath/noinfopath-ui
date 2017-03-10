[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)

___

[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.25 *

[![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)

Copyright (c) 2017 The NoInfoPath Group, LLC.

Licensed under the MIT License. (MIT)

___

noAutoComplete Directive
------------------------


### NoBtnGroupDirective

### NoButtonDirective

Extands a standard button element to support noActionQueue configurations
that are store in `area.json` files.


#### Configuration

```json

{
	myButtonConfig: {
"actions": [
			{
				"provider": "$state",
				"method": "go",
				"noContextParams": true,
				"params": [
					"efr.project.search",
					{
						"provider": "noStateHelper",
						"method": "makeStateParams",
						"params": [
							{
								"key": "id",
								"provider": "scope",
								"property": "document.ProjectID.ID"
							}
						],
						"passLocalScope": true
					}
				]
			}
		]
	}
}

```


 [NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 ___

 [NoInfoPath UI (noinfopath-ui)](home) * @version 2.0.41 *

 [![Build Status](http://gitlab.imginconline.com:8081/buildStatus/icon?job=noinfopath-ui&build=6)](http://gitlab.imginconline.com/job/noinfopath-data/6/)

 Copyright (c) 2017 The NoInfoPath Group, LLC.

 Licensed under the MIT License. (MIT)

 ___


## noDataPanel Directive

Renders a databound panel that can contain any kind of HTML content, which can be bound data on $scope.
The datasources bring bound to are NoInfoPath data providers.

### Sample HTML

 ```html
 <no-data-panel no-form="noForms.noComponents.foo"/>
 ```

|Property|Description|
|--------|-----------|
|no-form|The property that the configuration is located for the NoDataPanel|

### Sample Configuration

 ```json
 {
 	"foo": {
 		"scopeKey": "foo",
		"noDataPanel": {
			"version": 1,
			"saveOnRootScope": true,
			"resultType": "one"
			"refresh": {
				"property": "bar"
			},
			"templateUrl": "foo.html"
		},
		"noDataSource": {
 			"dataProvider": "noWebSQL",
 			"databaseName": "testdb",
 			"entityName": "Foo",
 			"primaryKey": "FooID",
			"filter": [
				{
					"field": "FooID",
					"operator": "eq",
					"value": {
						"source": "$stateParams",
						"property": "id"
					}
				}
			]
 		}
 	}
}
 ```

|Configuration Property|Type|Description|
|----------------------|----|-----------|
|scopeKey|String|The property that the NoDataPanel directive will databind to|
|noDataPanel|Object|A configuration object specific to the NoDataPanel directive|
|noDataPanel.refresh|Object|An object holding configuration that will trigger the NoDataPanel to request data again|
|noDataPanel.refresh.property|String|The property on the scope that the NoDataPanel to watch. On change, it will request the data again|
|noDataPanel.resultType|String|Default `one`. The type of call that will be performed when the NoDataPanel uses the NoDataSource to query for data|
|noDataPanel.saveOnRootScope|Boolean|Default false. Sets what NoDataPanel returns on the local scope if false, or the rootScope if true.|
|noDataPanel.templateUrl|String|The path to an html document to load within the NoDataPanel directive|
|noDataPanel.version|Interger|Default `1`. If version is `1`, NoDataPanel saves a [NoResults](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/classes) object to the scopeKey. If version is `2`, NoDataPanel saves a [NoDataModel](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/classes) object to the scopeKey|
|noDataSource|Object|Configuration for NoInfoPath Data NoDataSource. Read more here: [NoDataSource](http://gitlab.imginconline.com/noinfopath/noinfopath-data/wikis/data-source)|
TEST

[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)

NoInfoPath UI (noinfopath-ui)
=============================================

*@version 2.0.42* [![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)

Copyright (c) 2017 The NoInfoPath Group, LLC.

Licensed under the MIT License. (MIT)
___

<div class="no-ctrl-group" noid="NOIDbe97eec4fd53452ba72be0281d83bbad" dnd-list="" dnd-drop="">
	<label>Label</label>
	<control>
		<input class="form-control">
	</control>
</div>

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

[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)

___

[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.25 *

[![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)

Copyright (c) 2017 The NoInfoPath Group, LLC.

Licensed under the MIT License. (MIT)

___

noThumbnailViewer Directive
------------------------


