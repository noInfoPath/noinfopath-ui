 [NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)
 ___

 [NoInfoPath UI (noinfopath-ui)](home) * @version 2.0.49 *

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

