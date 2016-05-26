 # noinfopath.ui

 > @version 1.2.6
[![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)


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

