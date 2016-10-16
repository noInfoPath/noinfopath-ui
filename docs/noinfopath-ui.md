 # noinfopath.ui

 > @version 2.0.11
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

