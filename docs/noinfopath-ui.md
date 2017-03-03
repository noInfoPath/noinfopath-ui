 # noinfopath.ui

 > @version 2.0.25
[![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)


<div class="no-ctrl-group" noid="NOIDbe97eec4fd53452ba72be0281d83bbad" dnd-list="" dnd-drop="">
	<label>Label</label>
	<control>
		<input class="form-control">
	</control>
</div>

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


  ##  noDataPanel

  Renders a data bound panel that can contain
  any kind of HTML content, which can be bound
  data on $scope.  The data sources being bound
  to, are NoInfoPath Data Providers. Note that
  this directive calls noDataSource.one method,
  only returns a single data object, not an array.

  ### Sample Usage

  This sample show how to use the noDataPanel
  directive in your HTML markup.

  ```html
  <no-data-panel no-config="noForms.trialPlot.noComponents.selection"/>
  ```

  ### Sample Configuration

  ```js
  {
      "selection": {
          "scopeKey": "selection",
          "dataProvider": "noWebSQL",
          "databaseName": "FCFNv2",
          "entityName": "vw_trialplot_selection",
          "primaryKey": "TrialPlotID",
          "lookup": {
              "source": "$stateParams",
          },
          "templateUrl": "observations/selection.html"
      }
  }
  ```

  ##  noNotificationService

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
| id          | A specific id can be given so the same message cannot be shown repeatedly.                                    |

### How it Works
When append message is called, an element is appended to the DOM, off the `<no-notifications>` element.
It uses CSS defined in `_notification.scss`. `$interval` is used to update the `age` property on the element.
When the age is greater than the `ttl` defined in the options, the element is removed.

