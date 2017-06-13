### NoListSource Directive

Extends a standard select element to support noDataSource configuration

  #### HTML

  ```HTML
  <select no-list-source no-form="noForm.noComponents.states" class="form-control no-m-r-sm" ng-model="addressVw.state" name="state" placeholder="State" required style="width: 3.25em;"></select>
  ```

#### Configuration

```json

{
	"states": {
          "scopeKey": "states",
		"noDataSource": {
		    "dataProvider": "noHTTP",
		    "databaseName": "SOPDB",
		    "entityName": "us_states",
		    "primaryKey": "id",
		    "sort": [
                  {
				    "field": "code"
			    }
              ]
		},
		"noLookup": {
			"textField": "code",
			"valueField": "code",
			"ngModel": "newCompany.state",
			"name": "state",
			"required": true
		}
	}
}

```


