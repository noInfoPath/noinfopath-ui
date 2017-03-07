### NoBtnGroupDirective

### NoButtonDirective

Extands a standard button element to support noActionQueue configurations
that are store in `area.json` files.


#### Configuration

```json

{
	myButtonConfig: {
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


