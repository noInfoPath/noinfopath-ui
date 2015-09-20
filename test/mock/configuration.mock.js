//configuration.mock.js
var mockConfig = {
    "RESTURI": "http://fcfn-rest.img.local/odata",
    "AUTHURI": "http://fcfn-rest.img.local",
    "NOREST": "http://fcfn-rest.img.local",
    "NODBSCHEMAURI": "http://noinfopath-rest.img.local/api/NoDbSchema",
    "noDbSchema": [
		{
			"dbName": "NoInfoPath_dtc_v1",
			"provider": "noIndexedDb",
			"version": 1,
			"schemaSource": {
				"provider": "inline",
				"schema": {
					"NoInfoPath_Changes": {
						"entityType": "C",
						"primaryKey": "ChangeID"
					}
				}
			}
		},
		{
			"dbName": "FCFNv2",
			"provider": "noWebSQL",
			"version": 1,
			"description": "Fall Creek Variety Development Database",
			"size": 104857600,
	        "schemaSource": {
				"provider": "noDBSchema",
				"sourceDB": "fcfn2"
			}
		},
		{
			"dbName": "FCFNv2_Remote",
			"provider": "noHTTP",
			"schemaSource": {
				"provider": "cached",
				"sourceDB": "FCFNv2"
			}
		}
	],
    "Google": {
        "maps": {
            "center": {"lat": 37.652068, "lng": -85.576180},
            "initialize": {
                "zoomLevel": "all",
                "centerOn": "center",
                "defaultMarkerZoomLevel": "region"
            },
            "url": "https://maps.googleapis.com/maps/api/js?v=3&signed_in=true&callback=noGoogleMapsApiReady&API_KEY=AIzaSyBTGJZ3X44u-y1kWehT0UPmqlQF6Uyb_Xs",
            "zoomLevels": {
                "all": 4,
                "region": 8,
                "fieldSite": 12,
                "max": 16
            }
        }
    },
    "IndexedDB" : {
        "name": "NoInfoPath-v3",
        "version": 1
    },
    "defaults": {
        "GenusID": 2
    },
    "settings": {
        "messages": {
            "warning": "<p class='lead'>Note that this action is irriversable, and could lead to loss of data.</p><p class='lead'>Are you sure you want to continue?</p>",
            "manifest": "<p class='lead'>You are about to reload the data store manifest from the server.</p>",
            "allLookup": "<p class='lead'>You are about to reload all of the reference tables from the server.</p>",
            "allData": "<p class='lead'>You are about to reload all of the Variety Development data tables from the server.</p>",
            "everything": "<p class='lead'>You are about reload everything from the server.</p>"
        }
    },

    "lookups": {
        "LU_Action" : {
            "values": [
                {"columnName": "ActionTableID", "tableName": "LU_ActionTable", "textField": "Description", "valueField": "Value"}
            ],
            "model": {
                "id": "ActionID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "ActionTableID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "ActionTableID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "220px" }
            ]
        },
        "LU_ActionTable": {
            "model": {
                "id": "ActionTableID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Appearance": {
            "model": {
                "id": "AppearanceID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_BreedingProgram" : {
            "model": {
                "id": "BreedingProgramID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_ChangeUseGroup" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "UseGroupID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "220px" }
            ]
        },
        "LU_ChillGroup" : {
            "model": {
                "id": "ChillGroupID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Cluster" : {
            "model": {
                "id": "ClusterID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Color" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "ColorID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "220px" }
            ]
        },
        "LU_CrackedSplitLeaking" : {
            "model": {
                "id": "CrackedSplitLeakID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Cuteness" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "CutenessID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Defects" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "DefectID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Disease" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "DiseaseID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_DNAAction" : {
            "model": {
                "id": "DNAActionID",
                "fields": {
                    "Description": { "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_DNAResult" : {
            "model": {
                "id": "DNAResultID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_DNATestingAgency" : {
            "model": {
                "id": "DNATestingAgencyID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Firmness" : {
            "model": {
                "id": "FirmnessID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Flavor" : {
            "model": {
                "id": "FlavorID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_FruitSize" : {
            "model": {
                "id": "FruitSizeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_DNATestingPurpose" : {
            "model": {
                "id": "DNATestingPurposeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_FruitType" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "FruitTypeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Genus" : {
            "model": {
                "id": "GenusID",
                "fields": {
                    "Description": { "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Habit" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "HabitID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Harvest" : {
            "model": {
                "id": "HarvestID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_HarvestWeightUOM" : {
            "model": {
                "id": "HarvestWeightUOMID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Lab" : {
            "model": {
                "id": "LabID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_LikeIt" : {
            "model": {
                "id": "LikeItID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Location" : {
            "model": {
                "id": "LocationID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_LotType" : {
            "model": {
                "id": "LotTypeID",
                "fields": {
                    "ShortCode": { "validation": { "required": true } },
                    "DisplayName": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "ShortCode"},
                {"field": "DisplayName", "width": "150px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_MaterialType" : {
            "model": {
                "id": "MaterialTypeID",
                "fields": {
                    "Description": { "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_MechanicalHarvestPotential" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "MechanicalHarvestPotentialID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_OffColor" : {
            "model": {
                "id": "OffColorID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_PctRipe" : {
            "model": {
                "id": "PctRipeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_PercentColor" : {
            "model": {
                "id": "PercentColorID",
                "fields": {
                    "RGB": { "validation": { "required": true } },
                    "Percentage": { "type": "string", "validation": { "required": true } },
                    "Hue": {"type": "string", "validation": { "required": true }}
                }
            },
            "columns": [
                {"field": "RGB"},
                {"field": "Percentage", "width": "70px"},
                {"field": "Hue", "Title": "Hue", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_PlantHeight" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "PlantHeightID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_ProductSize" : {
            "model": {
                "id": "ProductSizeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_ReasonForDiscard" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "ReasonForDiscardID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Release" : {
            "model": {
                "id": "ReleaseID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Scar" : {
            "model": {
                "id": "ScarID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Season" : {
            "model": {
                "id": "SeasonID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_SizeConsistency" : {
            "model": {
                "id": "SizeConsistencyID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Species" : {
            "model": {
                "id": "SpeciesID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Stack" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "StackID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Stage" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "StageID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Status" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "StatusID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Type" : {
            "model": {
                "id": "TypeID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Vigor" : {
            "values": [
                {"columnName": "GenusID", "tableName": "LU_Genus", "textField": "Description", "valueField": "GenusID"}
            ],
            "model": {
                "id": "VigorID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } },
                    "GenusID": {"validation": {"required": true}}
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                {"field": "GenusID", "title": "Genus", "width": "120px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_VirusTestingAgency" : {
            "model": {
                "id": "VirusTestingAgencyID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        },
        "LU_Yield" : {
            "model": {
                "id": "YieldID",
                "fields": {
                    "Description": { "validation": { "required": true } },
                    "Value": { "type": "string", "validation": { "required": true } }
                }
            },
            "columns": [
                {"field": "Description"},
                {"field": "Value", "width": "70px"},
                { "command": ["edit", "destroy"], "title": "&nbsp;", "width": "210px" }
            ]
        }
    },
    "noArea2": {"name": "noRoot",
        "route": {
            "name": "vd",
            "url": "/vd",
            "templateUrl": "default.html",
            "abstract": true
        },
        "childAreas": [
            {"name": "dashboard",
                "noMenu": {
                    "title": "Home",
                    "state": "vd.home",
                    "glyph": "<span class=\"pull-right hidden-xs showopacity glyphicon glyphicon-home\"></span>"
                },
                "route": {
                    "name": "vd.home",
                    "url": "/home",
                    "templateUrl": "home.html"
                }
            },
            {"name": "observations",
                "noMenu": {
                    "title": "Observations",
                    "state": "vd.observations.cooperators",
                    "glyph": "<img class=\"pull-right hidden-xs showopacity\" src=\"images/ico_observation_sml.png\" />"
                },
                "route": {
                    "name": "vd.observations",
                    "url": "/observations",
                    "templateUrl": "observations/index.html",
                    "abstract": true
                },
                "childAreas": [

{
    "name": "cooperators",
    "title": "Observations - Choose Cooperator",
    "route": {
        "name": "vd.observations.cooperators",
        "url": "/coopertators",
        "templateUrl": "observations/cooperators.html"
    },
    "noComponents": [
        {
            "name": "grid",
            "dataProvider": "noWebSQL",
            "entityName": "vw_Cooperator_Summary",
            "kendoGrid": {
                "pageSize": 20,
                "pageable": {
                    "pageSize": 20
                },
                "primaryKey": "CooperatorID",
                "toState": "vd.observations.fieldsites",
                "columns": [
                    {"field": "Account", "width": "90px"},
                    {"field": "CooperatorName"},
                    {"field": "FieldSites", "type": "numeric", "title": "Field Sites", "width": "90px"},
                    {"field": "Trials", "type": "numeric", "title": "Trials", "width": "90px"},
                    {"field": "TrialPlots", "type": "numeric", "title": "Trial Plots", "width": "90px"},
                    {"field": "Observations", "type": "numeric", "title": "Observations", "width": "90px"}
                ]
            },
            "kendoDataSource": {
            }

        }
    ]
},

                    {"name": "fieldsites",
                        "title": "Observations - Choose Field Site",
                        "route": {
                            "name": "vd.observations.fieldsites",
                            "url": "/fieldsites/:CooperatorID",
                            "templateUrl": "observations/fieldsites-list.html"
                        },
                        "noDataSources": {
                            "fieldsites": {
                                "provider": "noIndexedDB",
                                "tableName": "FieldSites",
                                "model": {
                                    "id": "FieldSiteID",
                                    "fields": {
                                        "FieldName": { "type": "string"},
                                        "Trials" : {},
                                        "TrialPlots": {},
                                        "Observations": {}
                                    }
                                },
                                "sort": [{
                                    "field": "FieldName",
                                    "dir": "asc"
                                }],
                                "filter": [
                                    {"field": "CooperatorID", "operator": "eq", "value": {
                                        "source": "state",
                                        "property": "CooperatorID",
                                        "type": "string"
                                    }}
                                ],
                                "projections": [
                                    {
                                        "name": "Trials",
                                        "tableName": "Trials",
                                        "primaryKey": "FieldSiteID",
                                        "foreignKey": "FieldSiteID",
                                        "projections": [
                                            {
                                                "name": "TrialPlots",
                                                "tableName": "TrialPlots",
                                                "primaryKey": "TrialID",
                                                "foreignKey": "TrialID",
                                                "projections": [
                                                    {
                                                        "name": "Observations",
                                                        "tableName": "Observations",
                                                        "primaryKey": "TrialPlotID",
                                                        "foreignKey": "TrialPlotID"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "aggregators":{
                                    "fields": [
                                        "Trials",
                                        "TrialPlots",
                                        "Observations"
                                    ],
                                    "aggregations": [
                                        {
                                            "name": "Trials",
                                            "operation": "count",
                                            "path": "_Trials",
                                            "aggregations": [
                                                {
                                                    "name": "TrialPlots",
                                                    "operation": "count",
                                                    "path": "_TrialPlots",
                                                    "aggregations": [
                                                        {
                                                            "name": "Observations",
                                                            "operation": "count",
                                                            "path": "_Observations"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        "noComponents": {
                            "fieldsites": {
                                "primaryKey": "FieldSiteID",
                                "columns": [
                                    {"field": "FieldName"},
                                    {"field": "Trials", "title": "Trials"},
                                    {"field": "TrialPlots", "title": "Trial Plots"},
                                    {"field": "Observations", "title": "Observations"}
                                ],
                                "toState": "vd.observations.trials"
                            }
                        }
                    },
                    {"name": "observation",
                        "title": "Observations - Observation Editor",
                        "route": {
                            "name": "vd.observations.editor",
                            "url": "/editor/:ObservationID",
                            "templateUrl": "observations/editor/index.html"
                        },
                        "noDataSources": {
                            "observation": {
                                "provider": "noIndexedDB",
                                "tableName": "Observations",
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "ObservationID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "state",
                                            "property": "ObservationID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "trialplot": {
                                "provider": "noIndexedDB",
                                "tableName": "TrialPlots",
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "TrialPlotID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "TrialPlotID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "LU_Vigor": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Vigor",
                                "sort": [{"field": "Value", "dir": "asc"}],
                                "filter": [
                                    {
                                        "field": "GenusID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "observation.GenusID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "LU_Yield": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Yield",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_FruitSize": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_FruitSize",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_Firmness": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Firmness",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_Color": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Color",
                                "sort": [{"field": "Value", "dir": "asc"}],
                                "filter": [
                                    {
                                        "field": "GenusID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "observation.GenusID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "LU_Flavor": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Flavor",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_Scar": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Scar",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_Release": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Vigor",
                                "sort": [{"field": "Value", "dir": "asc"}],
                                "filter": [
                                   {
                                        "field": "GenusID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "observation.GenusID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "LU_Cluster": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Cluster",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_MechanicalHarvestPotential": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_MechanicalHarvestPotential",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            },
                            "LU_Status": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Status",
                                "sort": [{"field": "Value", "dir": "asc"}],
                                "filter": [
                                    {
                                        "field": "GenusID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "observation.GenusID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "LU_ChangeUseGroup": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_ChangeUseGroup",
                                "sort": [{"field": "Value", "dir": "asc"}],
                                "filter": [
                                    {
                                        "field": "GenusID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "observation.GenusID",
                                            "type": "string"
                                        }
                                    }

                                ]
                            },
                            "LU_Season": {
                                "provider": "noIndexedDB",
                                "tableName": "LU_Season",
                                "sort": [{"field": "Value", "dir": "asc"}]
                            }
                        },
                        "noComponents": {
                            "observation": {
                                "primaryKey": "ObservationID"
                            },
                            "trialplot": {

                            }
                        }
                    },
                    {"name": "trialplot",
                        "title": "Observations - Selection Summary",
                        "route": {
                            "name": "vd.observations.trialplot",
                            "url": "/summary/:TrialPlotID",
                            "templateUrl": "observations/summary/index.html"
                        },
                        "noDataSources": {
                            "trialplot": {
                                "provider": "noIndexedDB",
                                "tableName": "TrialPlots",
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "TrialPlotID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "state",
                                            "property": "TrialPlotID",
                                            "type": "string"
                                        }
                                    }
                                ],
                                "expand": {
                                    "SelectionID": {
                                        "name": "Selection",
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "foreignKey": "SelectionID",
                                        "merge": true
                                    }
                                }
                            },
                            "observations": {
                                "provider": "noIndexedDB",
                                "tableName": "Observations",
                                "sort": [{
                                    "field": "SelectionCode",
                                    "dir": "asc"
                                }],
                                "filter": [
                                    {
                                        "field": "TrialPlotID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.TrialPlotID",
                                            "type": "string"
                                        }
                                    }
                                ],
                                "model": {
                                    "id": "ObservationID",
                                    "fields": {
                                        "Comments": { "type": "string"},
                                        "FieldPlotCode": { "type": "string"},
                                        "GenusID": { "type": "string"},
                                        "ObservationDate": { "type": "date"},
                                        "ObservationID": { "type": "string"},
                                        "SelectionCode": { "type": "string"},
                                        "SuggestedStage": { "type": "string"},
                                        "TrialPlotID": {},
                                        "SelectionID": {}
                                   }
                                },
                                "expand": {
                                    "TrialPlotID": {
                                        "name": "TrialPlot",
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "foreignKey": "TrialPlotID",
                                        "fields": [
                                            "FieldPlotCode"
                                        ]
                                    }
                                }
                            },
                            "harvests": {
                                "provider": "noIndexedDB",
                                "tableName": "Harvests",
                                "model": {
                                    "id": "HarvestID",
                                    "fields": {
                                        "HarvestDate": { "type": "date" }
                                   }
                                },
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "SelectionID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.SelectionID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "crossings-male": {
                                "provider": "noIndexedDB",
                                "tableName": "Families",
                                "model": {
                                    "id": "FamilyInfoID",
                                    "fields": {
                                        "CrossCode": { "type": "string" },
                                        "SelectionCode": { "type": "string" }
                                   }
                                },
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "MaleParentSelectionID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.SelectionID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "crossings-female": {
                                "provider": "noIndexedDB",
                                "tableName": "Families",
                                "model": {
                                    "id": "FamilyInfoID",
                                    "fields": {
                                        "CrossCode": { "type": "string" },
                                        "SelectionCode": { "type": "string" }
                                   }
                                },
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "FemaleParentSelectionID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.SelectionID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "coolertrials": {
                                "provider": "noIndexedDB",
                                "tableName": "CoolerTrials",
                                "model": {
                                    "id": "CoolerTrialID",
                                    "fields": {
                                        "CoolerTrialID": {  }
                                   }
                                },
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "SelectionID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.SelectionID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            },
                            "frozencuts": {
                                "provider": "noIndexedDB",
                                "tableName": "FrozenCuts",
                                "model": {
                                    "id": "FrozenCutID",
                                    "fields": {
                                        "FrozenCutID": {  }
                                   }
                                },
                                "sort": [],
                                "filter": [
                                    {
                                        "field": "SelectionID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "scope",
                                            "property": "trialplot.SelectionID",
                                            "type": "string"
                                        }
                                    }
                                ]
                            }
                        },
                        "noComponents": {
                            "trialplot": {
                                "primaryKey": {
                                    "name": "TrialPlotID",
                                    "type": "Number"
                                }
                            },
                            "observations": {
                                "pageSize": 20,
                                "primaryKey": "ObservationID",
                                "toState": "vd.observations.editor",
                                "rowTemplate": "#ObservationViewTmpl",
                                "altRowTemplate": "#ObservationViewAltTmpl",
                                "columns": [
                                    {"field": "TrialPlotID", "title": "Field Plot Code"},
                                    {"field": "ObservationDate", "format": "{0:d}", "title": "Date Observed"},
                                    {"field": "SuggestedStage", "title": "Suggested Stage"}
                                ]
                            },
                            "harvests": {
                                "primaryKey": "HarvestID",
                                "columns": [
                                    {"field": "HarvestDate", "format": "{0:d}", "title": "Harvest Date"}
                                ]
                            },
                            "crossings": {
                                "primaryKey": "FamilyInfoID",
                                "columns": [
                                    {"field": "CrossCode", "title": "Cross Code"}
                                ]
                            },
                            "coolertrials": {
                                "primaryKey": "CoolerTrialID",
                                "columns": [
                                    {"field": "CoolerTrialID", "title": "Cooler Trial"}
                                ]
                            },
                            "frozencuts": {
                                "primaryKey": "FrozenCutID",
                                "columns": [
                                    {"field": "FrozenCutID", "title": "Frozen Cut"}
                                ]
                            }
                        }
                    },
                    {"name": "trialplots",
                        "title": "Observations - Choose a Trial Plot",
                        "route": {
                            "name": "vd.observations.trialplots",
                            "url": "/trialplots/:TrialID",
                            "templateUrl": "observations/trialplots.html"
                        },
                        "noDataSources": {
                            "trialplots": {
                                "provider": "noIndexedDB",
                                "tableName": "TrialPlots",
                                 "filter": [
                                    {
                                        "field": "TrialID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "state",
                                            "property": "TrialID",
                                            "type": "string"
                                        }
                                    }
                                ],
                                "sort": [{
                                    "field": "PlotName",
                                    "dir": "asc"
                                }],
                                "model": {
                                    "id": "TrialPlotID",
                                    "fields": {
                                        "SelectionCode": { "type": "string"},
                                        "FieldPlotCode": { "type": "string"},
                                        "Section": {},
                                        "Row": {},
                                        "DatePlanted":{ "type": "date"},
                                        "Observations": {}
                                    }
                                },
                                "projections": [
                                    {
                                        "name": "Observations",
                                        "tableName": "Observations",
                                        "primaryKey": "TrialPlotID",
                                        "foreignKey": "TrialPlotID"
                                    }
                                ],
                                "aggregators":{
                                    "fields": [
                                        "Observations"
                                    ],
                                    "aggregations": [
                                        {
                                            "name": "Observations",
                                            "operation": "count",
                                            "path": "_Observations"
                                        }
                                    ]
                                }
                            }
                        },
                        "noComponents": {
                            "trialplots": {
                                "primaryKey": "TrialPlotID",
                                "toState": "vd.observations.trialplot",
                                "columns": [
                                    {"field": "SelectionCode"},
                                    {"field": "FieldPlotCode"},
                                    {"field": "Section"},
                                    {"field": "Row"},
                                    {"field": "DatePlanted", "format": "{0:d}"},
                                    {"field": "Observations"}
                                ]
                            }
                        }
                    },
                    {"name": "trials",
                        "title": "Observations - Choose a Trial",
                        "route": {
                            "name": "vd.observations.trials",
                            "url": "/trials/:FieldSiteID",
                            "templateUrl": "observations/trials.html "
                        },
                        "noDataSources": {
                            "trials": {
                                "provider": "noIndexedDB",
                                "tableName": "Trials",
                                 "filter": [
                                    {
                                        "field": "FieldSiteID",
                                        "operator": "eq",
                                        "value": {
                                            "source": "state",
                                            "property": "FieldSiteID",
                                            "type": "string"
                                        }
                                    }
                                ],
                                "sort": [{
                                    "field": "TrialName",
                                    "dir": "asc"
                                }],
                                "model": {
                                    "id": "TrialID",
                                    "fields": {
                                        "TrialName": { "type": "string" },
                                        "DatePlanted": { "type": "date"},
                                        "TrialPlots": {},
                                        "Observations": {}
                                    }
                                },
                                "projections": [
                                    {
                                        "name": "TrialPlots",
                                        "tableName": "TrialPlots",
                                        "primaryKey": "TrialID",
                                        "foreignKey": "TrialID",
                                        "projections": [
                                            {
                                                "name": "Observations",
                                                "tableName": "Observations",
                                                "primaryKey": "TrialPlotID",
                                                "foreignKey": "TrialPlotID"
                                            }
                                        ]
                                    }
                                ],
                                "aggregators":{
                                    "fields": [
                                        "TrialPlots",
                                        "Observations"
                                    ],
                                    "aggregations": [
                                        {
                                            "name": "TrialPlots",
                                            "operation": "count",
                                            "path": "_TrialPlots",
                                            "aggregations": [
                                                {
                                                    "name": "Observations",
                                                    "operation": "count",
                                                    "path": "_Observations"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        "noComponents":{
                            "trials": {
                                "primaryKey": "TrialID",
                                "columns": [
                                    {"field": "TrialName", "title": "Trial Name"},
                                    {"field": "DatePlanted", "title": "Date Planted", "format": "{0:d}"},
                                    {"field": "TrialPlots", "title": "Trial Plots"},
                                    {"field": "Observations", "title": "Observations"}
                                ],
                                "toState": "vd.observations.trialplots"
                            }
                        }
                    }
                ]
            },
            {"name": "forms",
                "noMenu": {
                    "title": "Data Entry",
                    "glyph": "<img class=\"pull-right hidden-xs showopacity\" src=\"images/ico_dataentry_sml.png\" /><span class=\"caret\"></span>"
                },
                "route": {
                    "name": "vd.forms",
                    "url": "/forms",
                    "templateUrl": "editors/index.html",
                    "abstract": true
                },
                "childAreas": [
                    {"name" : "address",
                        "title": "Address Form",
                        "noMenu": {
                            "title": "Addresses",
                            "state": "vd.forms.address.summary"
                        },
                        "route": {
                            "name": "vd.forms.address",
                            "abstract" : true,
                            "url" : "/addresses",
                            "templateUrl" : "editors/address/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Address",
                                "route" : {
                                    "name": "vd.forms.address.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/address/summary.html"
                                },
                                "noDataSources" : {
                                    "address": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Addresses",
                                        "model": {
                                            "id": "AddressID",
                                            "fields": {
                                                "AddressID": {},
                                                "AddressName": {},
                                                "Country": {},
                                                "PhoneNumber": {}
                                            }
                                        }
                                    },
                                    "cooperators": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "model": {
                                            "id": "CooperatorID",
                                            "fields": {
                                                "CooperatorID": {},
                                                "CooperatorName": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "CooperatorName", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "address" : {
                                        "tableName": "Addresses",
                                        "primaryKey": "AddressID",
                                        "rowTemplate": "#AddressViewTmpl",
                                        "altRowTemplate": "#AddressViewAltTmpl",
                                        "toState": "vd.forms.address.editor",
                                        "columns": [
                                            {
                                                "field": "AddressName",
                                                "title": "Address Name"},
                                            {"field": "Country"},
                                            {
                                                "field": "PhoneNumber",
                                                "title": "Phone Number"
                                            }
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Address - Form",
                                "route": {
                                    "name": "vd.forms.address.editor",
                                    "url": "/edit/:AddressID",
                                    "templateUrl": "editors/address/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "address",
                                        "tableName": "Addresses",
                                        "primaryKey": {
                                            "name": "AddressID",
                                            "type": "string"
                                        }
                                    }
                                },
                                "noDataSources": {
                                    "cooperators": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "model": {
                                            "id": "CooperatorID",
                                            "fields": {
                                                "CooperatorID": {},
                                                "CooperatorName": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "CooperatorName", "dir": "asc"}
                                        ]
                                    },
                                    "address": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Addresses",
                                        "model": {
                                            "id": "AddressID",
                                            "fields": {
                                                "AddressID": {},
                                                "AddressName": {},
                                                "ContactName": {},
                                                "AddressLine1": {},
                                                "AddressLine2": {},
                                                "City": {},
                                                "State": {},
                                                "ZipCode": {},
                                                "Country": {},
                                                "CellNumber": {},
                                                "PhoneNumber": {},
                                                "Email": {},
                                                "notes": {}
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name": "coolertrial",
                        "title": "Cooler Trial Form",
                        "noMenu": {
                            "title": "Cooler Trials",
                            "state": "vd.forms.coolertrials.summary"
                        },
                        "route": {
                            "name": "vd.forms.coolertrials",
                            "abstract" : true,
                            "url" : "/coolertrials",
                            "templateUrl" : "editors/coolertrial/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Cooler Trial",
                                "route" : {
                                    "name": "vd.forms.coolertrials.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/coolertrial/summary.html"
                                },
                                "noDataSources": {
                                    "coolertrials": {
                                        "provider": "noIndexedDB",
                                        "tableName": "CoolerTrials",
                                        "model": {
                                            "id": "CoolerTrialID",
                                            "fields": {
                                                "HarvestID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "DaysInCooler": {
                                                    "parse": ["nonulls"]
                                                },
                                                "EvaluationDate": {
                                                    "type": "date",
                                                    "parse": ["nonulls"]
                                                },
                                                "FirmnessID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "FlavorID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Comments": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "EvaluationDate", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "HarvestID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "coolertrial.HarvestID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "FirmnessID": {
                                                "name": "Firmness",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Firmness",
                                                "foreignKey": "FirmnessID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            },
                                            "FlavorID": {
                                                "name": "Flavor",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Flavor",
                                                "foreignKey": "FlavorID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    },
                                    "selections": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "trialplots": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "model": {
                                            "id": "TrialPlotID",
                                            "fields": {
                                                "TrialPlotID": {},
                                                "FieldPlotCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldPlotCode", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "coolertrial.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "harvests": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "sort": [
                                            {"field": "HarvestDate", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "TrialPlotID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "coolertrial.TrialPlotID",
                                                "type": "string"
                                            }}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "coolertrials" : {
                                        "tableName": "CoolerTrials",
                                        "primaryKey": "CoolerTrialID",
                                        "toState": "vd.forms.coolertrials.editor",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {
                                            "field": "EvaluationDate",
                                            "format": "{0:d}",
                                            "title": "Evaluation Date",
                                            "filterable": {
                                                "cell": {
                                                    "operator": "eq"
                                                }
                                            }},
                                            {"field": "Firmness.Description", "title": "Firmness", "width": "90px"},
                                            {"field": "Flavor.Description", "title": "Flavor", "width": "90px"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Cooler Trial - Editor",
                                "route": {
                                    "name": "vd.forms.coolertrials.editor",
                                    "url": "/edit/:CoolerTrialID",
                                    "templateUrl": "editors/coolertrial/editor.html"
                                },
                                "noDataSources": {
                                    "coolertrial": {
                                        "provider": "noIndexedDB",
                                        "tableName": "CoolerTrials",
                                        "filter": [
                                            {"field": "CoolerTrialID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "CoolerTrialID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "HarvestID": {
                                                "name": "Harvest",
                                                "provider": "noIndexedDB",
                                                "tableName": "Harvests",
                                                "foreignKey": "HarvestID",
                                                "fields": [
                                                    "HarvestDate"
                                                ]
                                            }
                                        }
                                    },
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "trialplot": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "model": {
                                            "id": "TrialPlotID",
                                            "fields": {
                                                "TrialPlotID": {},
                                                "FieldPlotCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldPlotCode", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "coolertrial.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "harvest": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "sort": [
                                            {"field": "HarvestDate", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "TrialPlotID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "coolertrial.TrialPlotID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "firmness": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Firmness",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "flavor": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Flavor",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "coolertrial": {
                                        "name": "coolertrial",
                                        "tableName": "CoolerTrials",
                                        "primaryKey": {
                                            "name": "CoolerTrialID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },

                    {"name" : "culturelines",
                        "title": "Culture Line Form",
                        "noMenu": {
                            "title": "Culture Line",
                            "state": "vd.forms.culturelines.summary"
                        },
                        "route": {
                            "name": "vd.forms.culturelines",
                            "abstract" : true,
                            "url" : "/culturelines",
                            "templateUrl" : "editors/cultureline/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Culture Line",
                                "route" : {
                                    "name": "vd.forms.culturelines.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/cultureline/summary.html"
                                },
                                "noDataSources": {
                                    "culturelines": {
                                        "provider": "noIndexedDB",
                                        "tableName": "CultureLines",
                                        "model": {
                                            "id": "CultureLineID",
                                            "fields": {
                                                "CultureLine": {
                                                    "parse": ["nonulls"]
                                                },
                                                "LabID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "DateCultureLineStatusInactive": {
                                                    "type": "date",
                                                    "parse": ["nonulls"]
                                                },
                                                "Inactive": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "CultureLine", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "CultureLine", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "cultureline.LotID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "LabID": {
                                                "name": "Lab",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Lab",
                                                "foreignKey": "LabID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    },
                                    "selections": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        }
                                    },
                                    "lots": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Lots",
                                        "sort": [
                                            {"field": "LotNumber", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "LotID",
                                            "fields": {
                                                "LotID": {}
                                            }
                                        },
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "cultureline.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "culturelines" : {
                                        "tableName": "CultureLines",
                                        "primaryKey": "CultureLineID",
                                        "toState": "vd.forms.culturelines.editor",
                                        "rowTemplate": "#CultureLineViewTmpl",
                                        "altRowTemplate": "#CultureLineViewAltTmpl",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "CultureLine", "title": "Culture"},
                                            {"field": "LabID", "title": "Lab"},
                                            {"field": "DateCultureLineStatusInactive","format": "{0:d}", "title": "Date Inactive"},
                                            {"field": "Inactive", "title": "Inactive"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Culture Line - Editor",
                                "route": {
                                    "name": "vd.forms.culturelines.editor",
                                    "url": "/edit/:CultureLineID",
                                    "templateUrl": "editors/cultureline/editor.html"
                                },
                                "noDataSources" : {
                                    "cultureline": {
                                        "provider": "noIndexedDB",
                                        "tableName": "CultureLines",
                                        "filter": [
                                            {"field": "CultureLineID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "CultureLineID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "LotID": {
                                                "name": "LotID",
                                                "provider": "noIndexedDB",
                                                "tableName": "Lots",
                                                "foreignKey": "LotID",
                                                "fields": [
                                                    "LotNumber"
                                                ]
                                            }
                                        }
                                    },
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "lot": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Lots",
                                        "sort": [
                                            {"field": "LotNumber", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "cultureline.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "lab": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Lab",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "action": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Action",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "cultureline": {
                                        "name": "cultureLine",
                                        "tableName": "CultureLines",
                                        "primaryKey": {
                                            "name": "CultureLineID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "dnasamples",
                        "title": "DNA Sample Form",
                        "noMenu": {
                            "title": "DNA Samples",
                            "state": "vd.forms.dnasamples.summary"
                        },
                        "route": {
                            "name": "vd.forms.dnasamples",
                            "abstract" : true,
                            "url" : "/dnasamples",
                            "templateUrl" : "editors/dnasample/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "DNA Sample",
                                "route" : {
                                    "name": "vd.forms.dnasamples.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/dnasample/summary.html"
                                },
                                "noDataSources" : {
                                    "dnasamples": {
                                        "provider": "noIndexedDB",
                                        "tableName": "DNASamples",
                                        "model": {
                                            "id": "DNASampleID",
                                            "fields": {
                                                "SelectionID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "CollectionDate": {
                                                    "type": "date",
                                                    "parse": ["nonulls"]
                                                },
                                                "DNATestingAgencyID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "LocationID": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "DNASampleID", "dir": "asc"}
                                        ],
                                        "expand": {
                                            "SelectionID": {
                                                "name": "Selection",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            },
                                            "DNATestingAgencyID": {
                                                "name": "DNATestingAgency",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_DNATestingAgency",
                                                "foreignKey": "DNATestingAgencyID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            },
                                            "LocationID": {
                                                "name": "location",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Location",
                                                "foreignKey": "LocationID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "dnasamples" : {
                                        "tableName": "DNASamples",
                                        "primaryKey": "DNASampleID",
                                        "toState": "vd.forms.dnasamples.editor",
                                        "rowTemplate": "#DNASampleViewTmpl",
                                        "altRowTemplate": "#DNASampleViewAltTmpl",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "SelectionID" , "title": "Selection", "filterable": {
                                                "cell": {
                                                    "operator": "eq"
                                                }
                                            }},
                                            {"field": "CollectionDate", "title": "Collection Date"},
                                            {"field": "DNATestingAgencyID", "title": "Testing Agency"},
                                            {"field": "LocationID", "title": "Location"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "DNA Sample - Editor",
                                "route": {
                                    "name": "vd.forms.dnasamples.editor",
                                    "url": "/edit/:DNASampleID",
                                    "templateUrl": "editors/dnasample/editor.html"
                                },
                                "noDataSources" : {
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        }
                                    },
                                    "foundation": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FoundationPlants",
                                        "sort": [
                                            {"field": "FoundationPlantCode", "dir": "asc"}
                                        ]
                                    },
                                    "agency": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_VirusTestingAgency",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "location": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Location",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "lot": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Lots",
                                        "sort": [
                                            {"field": "LotNumber", "dir": "asc"}
                                        ]
                                    },
                                    "testingpurpose": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_DNATestingPurpose",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "actioncode": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Action",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "source": {
                                        "provider": "noIndexedDB",
                                        "tableName": "DNASamples",
                                        "sort": [
                                            {"field": "Source", "dir": "asc"}
                                        ]
                                    },
                                    "sourcelocation": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Location",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "dnasample": {
                                        "provider": "noIndexedDB",
                                        "tableName": "DNASamples",
                                        "filter": [
                                            {"field": "DNASampleID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "DNASampleID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "SelectionID": {
                                                "name": "Selection",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "merge": true,
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "dnasample": {
                                        "name": "dnasample",
                                        "tableName": "DNASamples",
                                        "primaryKey": {
                                            "name": "DNASampleID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "familyentries",
                        "title": "Family Entry Form",
                        "noMenu": {
                            "title": "Family Entry",
                            "state": "vd.forms.familyentries.summary"
                        },
                        "route": {
                            "name": "vd.forms.familyentries",
                            "abstract" : true,
                            "url" : "/familyentries",
                            "templateUrl" : "editors/familyentry/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Family Entry",
                                "route" : {
                                    "name": "vd.forms.familyentries.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/familyentry/summary.html"
                                },
                                "noDataSources": {
                                    "familyentries": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Families",
                                        "model": {
                                            "id": "FamilyID",
                                            "fields": {
                                                "FemaleParentSelectionID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "MaleParentSelectionID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "CrossCode": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Year": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "CrossCode", "dir": "asc"}
                                        ],
                                        "expand": {
                                            "FemaleParentSelectionID": {
                                                "name": "FemaleParent",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            },
                                            "MaleParentSelectionID": {
                                                "name": "MaleParent",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "familyentries" : {
                                        "tableName": "Families",
                                        "primaryKey": "FamilyID",
                                        "toState": "vd.forms.familyentries.editor",
                                        "rowTemplate": "#FamilyEntryViewTmpl",
                                        "altRowTemplate": "#FamilyEntryViewAltTmpl",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "FemaleParentSelectionID", "title": "Female Parent"},
                                            {"field": "MaleParentSelectionID", "title": "Male Parent"},
                                            {"field": "CrossCode", "title": "Cross Code"},
                                            {"field": "Year", "title": "Year"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Family Entry - Editor",
                                "route": {
                                    "name": "vd.forms.familyentries.editor",
                                    "url": "/edit/:FamilyID",
                                    "templateUrl": "editors/familyentry/editor.html"
                                },
                                "noDataSources": {
                                    "female": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Families",
                                        "sort": [
                                            {"field": "FemaleParentSelectionID", "dir": "asc"}
                                        ]
                                    },
                                    "male": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Families",
                                        "sort": [
                                            {"field": "MaleParentSelectionID", "dir": "asc"}
                                        ]
                                    },
                                    "breedingprogram": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_BreedingProgram",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "chillgroup": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_ChillGroup",
                                        "sort": [
                                            {"field": "ChillGroupID", "dir": "asc"}
                                        ]
                                    },
                                    "familyentry": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Families",
                                        "filter": [
                                            {"field": "FamilyID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "FamilyID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "BreedingProgramID": {
                                                "name": "Breeding",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_BreedingProgram",
                                                "foreignKey": "BreedingProgramID",
                                                "merge": true,
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "familyentry": {
                                        "name": "familyentry",
                                        "tableName": "Families",
                                        "primaryKey": {
                                            "name": "FamilyID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "fieldsites",
                        "title": "Field Site Form",
                        "noMenu": {
                            "title": "Field Site",
                            "state": "vd.forms.fieldsites.summary"
                        },
                        "route": {
                            "name": "vd.forms.fieldsites",
                            "abstract" : true,
                            "url" : "/fieldsites",
                            "templateUrl" : "editors/fieldsite/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Field Site",
                                "route" : {
                                    "name": "vd.forms.fieldsites.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/fieldsite/summary.html"
                                },
                                "noDataSources" : {
                                    "fieldsites": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FieldSites",
                                        "model": {
                                            "id": "FieldSiteID",
                                            "fields": {
                                                "Account": {
                                                    "parse": ["nonulls"]
                                                },
                                                "CooperatorName": {
                                                    "parse": ["nonulls"]
                                                },
                                                "FieldName": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Inactive": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldName", "dir": "asc"}
                                        ],
                                        "expand": {
                                            "CooperatorID": {
                                                "name": "Cooperator",
                                                "provider": "noIndexedDB",
                                                "tableName": "Cooperators",
                                                "foreignKey": "CooperatorID",
                                                "fields": [
                                                    "CooperatorName",
                                                    "Account"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "fieldsites" : {
                                        "tableName": "FieldSites",
                                        "primaryKey": "FieldSiteID",
                                        "toState": "vd.forms.fieldsites.editor",
                                        "rowTemplate": "#FieldSiteViewTmpl",
                                        "altRowTemplate": "#FieldSiteViewAltTmpl",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "Account", "title": "Account"},
                                            {"field": "CooperatorName", "title": "Cooperator"},
                                            {"field": "FieldName", "title": "Field Name"},
                                            {"field": "Inactive", "title": "Inactive"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Field Site - Editor",
                                "route": {
                                    "name": "vd.forms.fieldsites.editor",
                                    "url": "/edit/:FieldSiteID",
                                    "templateUrl": "editors/fieldsite/editor.html"
                                },
                                "noDataSources": {
                                    "fieldsite": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FieldSites",
                                        "filter": [
                                            {"field": "FieldSiteID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "FieldSiteID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "CooperatorID": {
                                                "name": "Cooperator",
                                                "provider": "noIndexedDB",
                                                "tableName": "Cooperators",
                                                "foreignKey": "CooperatorID",
                                                "fields": [
                                                    "CooperatorName"
                                                ]
                                            }
                                        }
                                    },
                                    "cooperator": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "sort": [
                                            {"field": "CooperatorID", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "CooperatorID",
                                            "fields": {
                                                "CooperatorID": {},
                                                "CooperatorName": {}
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "fieldsite": {
                                        "name": "fieldsite",
                                        "tableName": "FieldSites",
                                        "primaryKey": {
                                            "name": "FieldSiteID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "foundationplants",
                        "title": "Foundation Plant Form",
                        "noMenu": {
                            "title": "Foundation Plant",
                            "state": "vd.forms.foundationplants.summary"
                        },
                        "route": {
                            "name": "vd.forms.foundationplants",
                            "abstract" : true,
                            "url" : "/foundationplants",
                            "templateUrl" : "editors/foundationplant/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Foundation Plant",
                                "route" : {
                                    "name": "vd.forms.foundationplants.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/foundationplant/summary.html"
                                },
                                "noDataSources" : {
                                    "foundationplants": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FoundationPlants",
                                        "model": {
                                            "id": "FoundationPlantID",
                                            "fields": {
                                                "DateCreated": {
                                                    "type": "date",
                                                    "parse": ["nonulls"]
                                                },
                                                "FoundationPlantCode": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Inactive": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "FoundationPlantCode", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "foundationplants" : {
                                        "tableName": "FoundationPlants",
                                        "primaryKey": "FoundationPlantID",
                                        "toState": "vd.forms.foundationplants.editor",
                                        "rowTemplate": "#FoundationPlantViewTmpl",
                                        "altRowTemplate": "#FoundationPlantAltTmpl",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "DateCreated", "format": "{0:yyyy-MM-dd}", "title": "Creation Date"},
                                            {"field": "FoundationPlantCode", "title": "Foundation Code"},
                                            {"field": "Inactive"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Foundation Plant - Editor",
                                "route": {
                                    "name": "vd.forms.foundationplants.editor",
                                    "url": "/edit/:FoundationPlantID",
                                    "templateUrl": "editors/foundationplant/editor.html"
                                },
                                "noDataSources" : {
                                    "foundationplant": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FoundationPlants",
                                        "filter": [
                                            {"field": "FoundationPlantID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "FoundationPlantID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "ProductSizeID": {
                                                "name": "ProductSize",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_ProductSize",
                                                "foreignKey": "ProductSizeID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    },
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "productsize": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_ProductSize",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "foundationplant": {
                                        "name": "foundationplant",
                                        "tableName": "FoundationPlants",
                                        "primaryKey": {
                                            "name": "FoundationPlantID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "frozencuts",
                        "title": "Frozen Cut Form",
                        "noMenu": {
                            "title": "Frozen Cut",
                            "state": "vd.forms.frozencuts.summary"
                        },
                        "route": {
                            "name": "vd.forms.frozencuts",
                            "abstract" : true,
                            "url" : "/frozencuts",
                            "templateUrl" : "editors/frozencut/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Frozen Cut",
                                "route" : {
                                    "name": "vd.forms.frozencuts.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/frozencut/summary.html"
                                },
                                "noDataSources" : {
                                    "selections": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "trialplots": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "model": {
                                            "id": "TrialPlotID",
                                            "fields": {
                                                "TrialPlotID": {},
                                                "FieldPlotCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldPlotCode", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "frozencut.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "harvests": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "model": {
                                            "id": "HavestID",
                                            "fields": {
                                                "HarvestID": {},
                                                "HarvestDate": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "HarvestDate", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "TrialPlotID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "frozencut.TrialPlotID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "frozencuts": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FrozenCuts",
                                        "model": {
                                            "id": "FrozenCutID",
                                            "fields": {
                                                "EvaluationDate": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Evaluator": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Comments": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "EvaluationDate", "dir": "desc"}
                                        ],
                                        "filter": [
                                            {"field": "HarvestID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "frozencut.HarvestID",
                                                "type": "string"
                                            }}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "frozencuts" : {
                                        "tableName": "FrozenCuts",
                                        "primaryKey": "FrozenCutID",
                                        "toState": "vd.forms.frozencuts.editor",
                                        "columns": [
                                            {"field": "EvaluationDate"},
                                            {"field": "Evaluator"},
                                            {"field": "Comments"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Frozen Cut - Editor",
                                "route": {
                                    "name": "vd.forms.frozencuts.editor",
                                    "url": "/edit/:FrozenCutID",
                                    "templateUrl": "editors/frozencut/editor.html"
                                },
                                "noDataSources": {
                                    "selections": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "evaluator": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FrozenCuts",
                                        "sort": [
                                            {"field": "Evaluator", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "Evaluator",
                                            "fields": {
                                                "Evaluator": {}
                                            }
                                        }
                                    },
                                    "offcolor": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_OffColor",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "OffColorID",
                                            "fields": {
                                                "OffColorID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "flavor": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Flavor",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "FlavorID",
                                            "fields": {
                                                "FlavorID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "firmness": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Firmness",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "FirmnessID",
                                            "fields": {
                                                "FirmnessID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "crackedsplitleaking": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_CrackedSplitLeaking",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "CrackedSplitLeakingID",
                                            "fields": {
                                                "CrackedSplitLeakingID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "sizeconsistency": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_SizeConsistency",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "SizeConsistencyID",
                                            "fields": {
                                                "SizeConsistencyID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "appearence": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Appearance",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "AppearanceID",
                                            "fields": {
                                                "AppearanceID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "likeit": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_LikeIt",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ],
                                        "model": {
                                            "id": "LikeItID",
                                            "fields": {
                                                "LikeItID": {},
                                                "Description": {}
                                            }
                                        }
                                    },
                                    "frozencut": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FrozenCuts",
                                        "filter": [
                                            {"field": "FrozenCutID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "FrozenCutID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "OffColorID": {
                                                "name": "OffColor",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_OffColor",
                                                "foreignKey": "OffColorID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    },
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "trialplot": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "model": {
                                            "id": "TrialPlotID",
                                            "fields": {
                                                "TrialPlotID": {},
                                                "FieldPlotCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldPlotCode", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "frozencut.SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "harvest": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "model": {
                                            "id": "HavestID",
                                            "fields": {
                                                "HarvestID": {},
                                                "HarvestDate": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "HarvestDate", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "TrialPlotID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "frozencut.TrialPlotID",
                                                "type": "string"
                                            }}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "frozencut": {
                                        "name": "frozencut",
                                        "tableName": "FrozenCuts",
                                        "primaryKey": {
                                            "name": "FrozenCutID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "harvests",
                        "title": "Harvest Form",
                        "noMenu": {
                            "title": "Harvest",
                            "state": "vd.forms.harvests.summary"
                        },
                        "route": {
                            "name": "vd.forms.harvests",
                            "abstract" : true,
                            "url" : "/harvests",
                            "templateUrl" : "editors/harvest/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Harvest",
                                "route" : {
                                    "name": "vd.forms.harvests.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/harvest/summary.html"
                                },
                                "noDataSources" : {
                                    "harvests": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "model": {
                                            "id": "HarvestID",
                                            "fields": {
                                                "HarvestDate": {
                                                    "parse": ["nonulls"]
                                                },
                                                "HarvestID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "HarvestWeight": {
                                                    "parse": ["nonulls"]
                                                },
                                                "PickNumber": {
                                                    "parse": ["nonulls"]
                                                },
                                                "QuantityPlants": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "HarvestDate", "dir": "desc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "harvests" : {
                                        "tableName": "Harvests",
                                        "primaryKey": "HarvestID",
                                        "rowTemplate": "#HarvestViewTmpl",
                                        "altRowTemplate": "#HarvestAltTmpl",
                                        "toState": "vd.forms.harvests.editor",
                                        "columns": [
                                            {"field": "HarvestDate", "title": "Harvest Date"},
                                            {"field": "HarvestWeight", "title": "Weight"},
                                            {"field": "PickNumber", "title": "Pick Number"},
                                            {"field": "QuantityPlants", "title": "Quantity Of Plants"}
                                        ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Harvest - Editor",
                                "route": {
                                    "name": "vd.forms.harvests.editor",
                                    "url": "/edit/:HarvestID",
                                    "templateUrl": "editors/harvest/editor.html"
                                },
                                "noDataSources": {
                                    "harvest": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Harvests",
                                        "sort": [
                                            {"field": "HarvestID", "dir": "asc"}
                                        ]
                                    },
                                    "cooperators": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "sort": [
                                            {"field": "CooperatorID", "dir": "asc"}
                                        ]
                                    },
                                    "fieldsites": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FieldSites",
                                        "sort": [
                                            {"field": "FieldSiteID", "dir": "asc"}
                                        ]
                                    },
                                    "trials": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrailPlots",
                                        "sort": [
                                            {"field": "TrialID", "dir": "asc"}
                                        ]
                                    },
                                    "trialplotss": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrailPlots",
                                        "sort": [
                                            {"field": "TrialPlotID", "dir": "asc"}
                                        ]
                                    },
                                    "selections": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    },
                                    "harvestweightsUOM": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_HarvestWeightUOM",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "harvest": {
                                        "name": "harvest",
                                        "tableName": "Harvests",
                                        "primaryKey": {
                                            "name": "HarvestID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "inventories",
                        "title": "Inventory Form",
                        "noMenu": {
                            "title": "Inventory",
                            "state": "vd.forms.inventories.summary"
                        },
                        "route": {
                            "name": "vd.forms.inventories",
                            "abstract" : true,
                            "url" : "/inventories",
                            "templateUrl" : "editors/inventory/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Inventory",
                                "route" : {
                                    "name": "vd.forms.inventories.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/inventory/summary.html"
                                },
                                "noDataSources" : {
                                    "inventories": {
                                        "provider": "noIndexedDB",
                                        "tableName": "NurseryInventories",
                                        "model": {
                                            "id": "InventoryID",
                                            "fields": {
                                                "SelectionID": {
                                                    "parse": ["nonulls"]
                                                },
                                                "DatePotted": {
                                                    "type": "date",
                                                    "parse": ["nonulls"]
                                                },
                                                "QtyNumber2": {
                                                    "parse": ["nonulls"]
                                                },
                                                "ProductSizeID": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "sort": [
                                            {"field": "DatePotted", "dir": "desc"}
                                        ],
                                        "expand": {
                                            "ProductSizeID": {
                                                "name": "ProductSizeID",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_ProductSize",
                                                "foreignKey": "ProductSizeID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            },
                                            "SelectionID": {
                                                "name": "SelectionID",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "inventories" : {
                                        "tableName": "NurseryInventories",
                                        "primaryKey": "InventoryID",
                                        "rowTemplate": "#InventoryViewTmpl",
                                        "altRowTemplate": "#InventoryAltTmpl",
                                        "toState": "vd.forms.inventories.editor",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "SelectionID", "title": "Selection"},
                                            {"field": "DatePotted", "format": "{0:d}" ,"title": "Pot Date"},
                                            {"field": "QtyNumber2", "title": "Quantity"},
                                            {"field": "ProductSizeID", "title": "Size"}
                                        ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Inventory - Editor",
                                "route": {
                                    "name": "vd.forms.inventories.editor",
                                    "url": "/edit/:InventoryID",
                                    "templateUrl": "editors/inventory/editor.html"
                                },
                                "noDataSources" : {
                                    "inventory": {
                                        "provider": "noIndexedDB",
                                        "tableName": "NurseryInventories",
                                        "filter": [
                                            {"field": "InventoryID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "InventoryID",
                                                "type": "string"
                                            }}
                                        ],
                                        "expand": {
                                            "ProductSizeID": {
                                                "name": "ProductSize",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_ProductSize",
                                                "foreignKey": "ProductSizeID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    },
                                    "productsize": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_ProductSize",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "location": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Location",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "inventory": {
                                        "name": "inventory",
                                        "tableName": "NurseryInventories",
                                        "primaryKey": {
                                            "name": "InventoryID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    },
{"name" : "lots",
    "title": "Lot Form",
    "noMenu": {
        "title": "Lot",
        "state": "vd.forms.lots.summary"
    },
    "route": {
        "name": "vd.forms.lots",
        "abstract" : true,
        "url" : "/lots",
        "templateUrl" : "editors/lot/index.html"
    },
    "childAreas": [
        {"name": "summary",
            "title": "Lot",
            "route" : {
                "name": "vd.forms.lots.summary",
                "url": "/summary",
                "templateUrl": "editors/lot/summary.html"
            },
            "noDataSources" : {
                "lots": {
                    "provider": "noIndexedDB",
                    "tableName": "Lots",
                    "model": {
                        "id": "LotID",
                        "fields": {
                            "SelectionID": {
                                "parse": ["nonulls"]
                            },
                            "LotTypeID": {
                                "parse": ["nonulls"]
                            },
                            "LotNumber": {
                                "parse": ["nonulls"]
                            },
                            "Source": {
                                "parse": ["nonulls"]
                            },
                            "Date": {
                                "type": "date",
                                "parse": ["nonulls"]
                            },
                            "ActionRequired": {
                                "parse": ["nonulls"]
                            }
                        }
                    },
                    "sort": [
                        {"field": "LotNumber", "dir": "asc"}
                    ],
                    "expand": {
                        "LotTypeID": {
                            "name": "LotTypeID",
                            "provider": "noIndexedDB",
                            "tableName": "LU_LotType",
                            "foreignKey": "LotTypeID",
                            "fields": [
                                "ShortCode"
                            ]
                        },
                        "SelectionID": {
                            "name": "SelectionID",
                            "provider": "noIndexedDB",
                            "tableName": "Selections",
                            "foreignKey": "SelectionID",
                            "fields": [
                                "SelectionCode"
                            ]
                        }
                    }
                }
            },
            "noComponents" : {
                "lots" : {
                    "tableName": "Lots",
                    "primaryKey": "LotID",
                    "rowTemplate": "#LotViewTmpl",
                    "altRowTemplate": "#LotViewAltTmpl",
                    "toState": "vd.forms.lots.editor",
                    "filterable": {
                        "mode": "row"
                    },
                    "columns": [
                        {"field": "SelectionID", "title": "Selection"},
                        {"field": "LotTypeID", "title": "Lot Type"},
                        {"field": "LotNumber", "title": "Lot Number"},
                        {"field": "Source", "title": "Source"},
                        {"field": "Date", "title": "Date"},
                        {"field": "ActionRequired", "title": "Action Required"}
                     ]
                }
            }
        },
        {"name": "editor",
            "title": "Lot - Editor",
            "route": {
                "name": "vd.forms.lots.editor",
                "url": "/edit/:LotID",
                "templateUrl": "editors/lot/editor.html"
            },
            "noDataSources" : {
                "lot": {
                    "provider": "noIndexedDB",
                    "tableName": "Lots",
                    "filter": [
                        {"field": "LotID", "operator": "eq", "value": {
                            "source": "state",
                            "property": "LotID",
                            "type": "string"
                        }}
                    ]
                },
                "lottype": {
                    "provider": "noIndexedDB",
                    "tableName": "LU_LotType",
                    "sort": [
                        {"field": "DisplayName", "dir": "asc"}
                    ]
                },
                "location": {
                    "provider": "noIndexedDB",
                    "tableName": "LU_Location",
                    "sort": [
                        {"field": "Description", "dir": "asc"}
                    ]
                },
                "materialtype": {
                    "provider": "noIndexedDB",
                    "tableName": "LU_MaterialType",
                    "sort": [
                        {"field": "Description", "dir": "asc"}
                    ]
                }
            },
            "noComponents" : {
                "lot": {
                    "name": "lot",
                    "tableName": "Lots",
                    "primaryKey": {
                        "name": "LotID",
                        "type": "string"
                    }
                }
            }
        }
    ]
},
                    {"name" : "order",
                        "title": "Order Form",
                        "noMenu": {
                            "title": "Order",
                            "state": "vd.forms.orders.summary"
                        },
                        "route": {
                            "name": "vd.forms.orders",
                            "abstract" : true,
                            "url" : "/orders",
                            "templateUrl" : "editors/order/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Order",
                                "route" : {
                                    "name": "vd.forms.orders.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/order/summary.html"
                                },
                                "noDataSources" : {
                                    "order": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Orders",
                                        "model": {
                                            "id": "OrderID",
                                            "fields": {
                                                "OrderID": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "OrderNumber", "dir": "desc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "order" : {
                                        "pageSize": 20,
                                        "tableName": "Orders",
                                        "primaryKey": "OrderID",
                                        "sort": [],
                                        "toState": "vd.forms.orders.editor",
                                        "model": {
                                            "id": "OrderID",
                                            "fields": {
                                                "OrderID": {},
                                                "OrderNumber": {},
                                                "TargetShipDate": {},
                                                "DateShipped": {},
                                                "ShipToAddress": {},
                                                "DateCreated": {}
                                            }
                                        },
                                        "columns": [
                                            {"field": "OrderNumber"},
                                            {"field": "TargetShipDate"},
                                            {"field": "DateShipped"},
                                            {"field": "ShipToAddress"},
                                            {"field": "DateCreated"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Order - Editor",
                                "route": {
                                    "name": "vd.forms.orders.editor",
                                    "url": "/edit/:OrderID",
                                    "templateUrl": "editors/order/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "order",
                                        "tableName": "Orders",
                                        "primaryKey": {
                                            "name": "OrderID",
                                            "type": "Number"
                                        }
                                    }
                                }
                            }
                        ]
                    },

                    {"name" : "postharvests",
                        "title": "Post Harvest Form",
                        "noMenu": {
                            "title": "Post Harvest",
                            "state": "vd.forms.postharvests.summary"
                        },
                        "route": {
                            "name": "vd.forms.postharvests",
                            "abstract" : true,
                            "url" : "/postharvests",
                            "templateUrl" : "editors/postharvest/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "route" : {
                                    "name": "vd.forms.postharvests.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/postharvest/summary.html"
                                },
                                "noComponents" : {
                                    "postharvests" : {
                                        "pageSize": 20,
                                        "tableName": "PostHarvest",
                                        "primaryKey": "PostHarvestID",
                                        "sort": [],
                                        "toState": "vd.forms.postharvests.editor",
                                        "model": {
                                            "id": "PostHarvestID",
                                            "fields": {
                                                "PostHarvestID": {},
                                                "BerriesPer227g": {},
                                                "QtyOfCulls": {},
                                                "PercentBrix1": {},
                                                "PercentBrix2": {},
                                                "AvgBerryWt": {},
                                                "QtyGreaterThan16mm": {},
                                                "QtyLessThan16mm": {},
                                                "FirmTechDay0": {},
                                                "FirmTechDay14": {},
                                                "Notes": {}
                                            }
                                        },
                                        "columns": [
                                            {"field": "BerriesPer227g"},
                                            {"field": "QtyOfCulls"},
                                            {"field": "PercentBrix1"},
                                            {"field": "PercentBrix2"},
                                            {"field": "AvgBerryWt"},
                                            {"field": "QtyGreaterThan16mm"},
                                            {"field": "QtyLessThan16mm"},
                                            {"field": "FirmTechDay0"},
                                            {"field": "FirmTechDay14"},
                                            {"field": "Notes"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "route": {
                                    "name": "vd.forms.postharvests.editor",
                                    "url": "/edit/:PostHarvestID",
                                    "templateUrl": "editors/postharvest/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "dnasample",
                                        "tableName": "DNASamples",
                                        "primaryKey": {
                                            "name": "DNASampleID",
                                            "type": "Number"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "selectionentries",
                        "title": "Selecetion Entry Form",
                        "noMenu": {
                            "title": "Selection Entry",
                            "state": "vd.forms.selectionentries.summary"
                        },
                        "route": {
                            "name": "vd.forms.selectionentries",
                            "abstract" : true,
                            "url" : "/selectionentries",
                            "templateUrl" : "editors/selectionentry/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Selecetion Entry",
                                "route" : {
                                    "name": "vd.forms.selectionentries.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/selectionentry/summary.html"
                                },
                                "noDataSources" : {
                                    "selectionentries": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionCode": {},
                                                "FamilyID": {},
                                                "StageID": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldName", "dir": "asc"}
                                        ],
                                        "expand": {
                                            "FamilyID": {
                                                "name": "FamilyID",
                                                "provider": "noIndexedDB",
                                                "tableName": "Families",
                                                "foreignKey": "FamilyID",
                                                "fields": [
                                                    "CrossCode"
                                                ]
                                            },
                                            "StageID": {
                                                "name": "StageID",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Stage",
                                                "foreignKey": "StageID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "selectionentries" : {
                                        "tableName": "Selections",
                                        "primaryKey": "SelectionID",
                                        "rowTemplate": "#SelectionEntryViewTmpl",
                                        "altRowTemplate": "#SelectionEntryViewAltTmpl",
                                        "toState": "vd.forms.selectionentries.editor",
                                        "filterable": {
                                            "mode": "row"
                                        },
                                        "columns": [
                                            {"field": "SelectionCode"},
                                            {"field": "FamilyID"},
                                            {"field": "StageID"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Selecetion Entry - Editor",
                                "route": {
                                    "name": "vd.forms.selectionentries.editor",
                                    "url": "/edit/:SelectionID",
                                    "templateUrl": "editors/selectionentry/editor.html"
                                },
                                "noDataSources" : {
                                    "selectionentry": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "filter": [
                                            {"field": "SelectionID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "SelectionID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "stage": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Stage",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    },
                                    "location": {
                                        "provider": "noIndexedDB",
                                        "tableName": "LU_Location",
                                        "sort": [
                                            {"field": "Description", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "selection",
                                        "tableName": "Selections",
                                        "primaryKey": {
                                            "name": "SelectionID",
                                            "type": "Number"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "selectionprofiles",
                        "title": "Selection Profile Form",
                        "noMenu": {
                            "title": "Selection Profile",
                            "state": "vd.forms.selectionprofiles.summary"
                        },
                        "route": {
                            "name": "vd.forms.selectionprofiles",
                            "abstract" : true,
                            "url" : "/selectionprofiles",
                            "templateUrl" : "editors/selectionprofile/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Selection Profile",
                                "route" : {
                                    "name": "vd.forms.selectionprofiles.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/selectionprofile/summary.html"
                                },
                                "noDataSources" : {
                                    "selectionprofiles": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionCode": {},
                                                "ABECASCode": {},
                                                "ABECASSpeciesCode": {},
                                                "OfficiallyNamed": {},
                                                "Catalog": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldName", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "selectionprofiles" : {
                                        "tableName": "Selections",
                                        "primaryKey": "SelectionID",
                                        "rowTemplate": "#SelectionProfileViewTmpl",
                                        "altRowTemplate": "#SelectionProfileViewAltTmpl",
                                        "toState": "vd.forms.selectionprofiles.editor",
                                        "columns": [
                                            {"field": "SelectionCode", "title": "Selection"},
                                            {"field": "ABECASCode", "title": "ABECAS"},
                                            {"field": "ABECASSpeciesCode", "title": "ABECAS Species"},
                                            {"field": "OfficiallyNamed", "title": "Officially Name?"},
                                            {"field": "Catalog"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Selection Profile - Editor",
                                "route": {
                                    "name": "vd.forms.selectionprofiles.editor",
                                    "url": "/edit/:SelectionID",
                                    "templateUrl": "editors/selectionprofile/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "selectionprofile",
                                        "tableName": "Selections",
                                        "primaryKey": {
                                            "name": "SelectionID",
                                            "type": "Number"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "trial",
                        "title": "Trial Form",
                        "noMenu": {
                            "title": "Trials",
                            "state": "vd.forms.trials.summary"
                        },
                        "route": {
                            "name": "vd.forms.trials",
                            "abstract" : true,
                            "url" : "/trials",
                            "templateUrl" : "editors/trial/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Trial",
                                "route" : {
                                    "name": "vd.forms.trials.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/trial/summary.html"
                                },
                                "noDataSources" : {
                                    "trials": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Trials",
                                        "model": {
                                            "id": "TrialID",
                                            "fields": {
                                                "TrialID": {},
                                                "DatePlanted": {}
                                            }
                                        },
                                        "sort": [

                                        ],
                                        "filter": [

                                        ],
                                        "expand": {

                                        }
                                    },
                                    "cooperators": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "model": {
                                            "id": "CooperatorID",
                                            "fields": {
                                                "CooperatorID": {},
                                                "CooperatorName": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "CooperatorName", "dir": "asc"}
                                        ]
                                    },
                                    "fieldsites": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FieldSites",
                                        "model": {
                                            "id": "FieldSiteID",
                                            "fields": {
                                                "Account": {
                                                    "parse": ["nonulls"]
                                                },
                                                "CooperatorName": {
                                                    "parse": ["nonulls"]
                                                },
                                                "FieldName": {
                                                    "parse": ["nonulls"]
                                                },
                                                "Inactive": {
                                                    "parse": ["nonulls"]
                                                }
                                            }
                                        },
                                        "filter": [
                                            {"field": "CooperatorID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "trial.CooperatorID",
                                                "type": "string"
                                            }}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "trials" : {
                                        "tableName": "Trials",
                                        "primaryKey": "TrialID",
                                        "rowTemplate": "#TrialViewTmpl",
                                        "altRowTemplate": "#TrialViewAltTmpl",
                                        "toState": "vd.forms.trials.editor",
                                        "columns": [
                                            {"field": "Trial"},
                                            {"field": "DatePlanted",
                                            "format": "{0:d}",
                                            "title": "Date Planted" }
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Trial - Form",
                                "route": {
                                    "name": "vd.forms.trials.editor",
                                    "url": "/edit/:TrialID",
                                    "templateUrl": "editors/trial/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "trial",
                                        "tableName": "Trials",
                                        "primaryKey": {
                                            "name": "TrialID",
                                            "type": "string"
                                        }
                                    }
                                },
                                "noDataSources": {
                                    "cooperators": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Cooperators",
                                        "model": {
                                            "id": "CooperatorID",
                                            "fields": {
                                                "CooperatorID": {},
                                                "CooperatorName": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "CooperatorName", "dir": "asc"}
                                        ]
                                    },
                                    "fieldsites": {
                                        "provider": "noIndexedDB",
                                        "tableName": "FieldSites",
                                        "model": {
                                            "id": "FieldSiteID",
                                            "fields": {
                                                "FieldSiteID": {},
                                                "FieldName": {}
                                            }
                                        },
                                        "filter": [
                                            {"field": "CooperatorID", "operator": "eq", "value": {
                                                "source": "scope",
                                                "property": "trial.CooperatorID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "trial": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Trials",
                                        "model": {
                                            "id": "TrialID",
                                            "fields": {
                                                "TrialID": {},
                                                "TrialName": {},
                                                "DatePlanted": {}
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "trialplots",
                        "title": "Trial Plot Form",
                        "noMenu": {
                            "title": "Trial Plots",
                            "state": "vd.forms.trialplots.summary"
                        },
                        "route": {
                            "name": "vd.forms.trialplots",
                            "abstract" : true,
                            "url" : "/trialplots",
                            "templateUrl" : "editors/trialplot/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Trial Plot",
                                "route" : {
                                    "name": "vd.forms.trialplots.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/trialplot/summary.html"
                                },
                                "noDataSources" : {
                                    "trialplots": {
                                        "provider": "noIndexedDB",
                                        "tableName": "TrialPlots",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "TrialID": {},
                                                "DateCreated": {},
                                                "Row": {},
                                                "FieldOrder": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "FieldPlotCode", "dir": "asc"}
                                        ],
                                        "expand": {
                                            "TrialID": {
                                                "name": "TrialID",
                                                "provider": "noIndexedDB",
                                                "tableName": "Trials",
                                                "foreignKey": "TrialID",
                                                "fields": [
                                                    "TrialName"
                                                ]
                                            },
                                            "SelectionID": {
                                                "name": "SelectionID",
                                                "provider": "noIndexedDB",
                                                "tableName": "Selections",
                                                "foreignKey": "SelectionID",
                                                "fields": [
                                                    "SelectionCode"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "trialplots" : {
                                        "tableName": "TrialPlots",
                                        "primaryKey": "TrialPlotID",
                                        "rowTemplate": "#TrailPlotViewTmpl",
                                        "altRowTemplate": "#TrailPlotViewAltTmpl",
                                        "toState": "vd.forms.trialplots.editor",
                                        "columns": [
                                            {"field": "SelectionID"},
                                            {"field": "TrialID"},
                                            {"field": "DateCreated"},
                                            {"field": "Row"},
                                            {"field": "FieldOrder"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Trial Plot - Form",
                                "route": {
                                    "name": "vd.forms.trialplots.editor",
                                    "url": "/edit/:TrialPlotID",
                                    "templateUrl": "editors/trialplot/editor.html"
                                },
                                "noComponents" : {
                                    "noForm": {
                                        "name": "trialplot",
                                        "tableName": "TrialPlots",
                                        "primaryKey": {
                                            "name": "TrialPlotID",
                                            "type": "Number"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {"name" : "viruses",
                        "title": "Virus Form",
                        "noMenu": {
                            "title": "Virus",
                            "state": "vd.forms.viruses.summary"
                        },
                        "route": {
                            "name": "vd.forms.viruses",
                            "abstract" : true,
                            "url" : "/viruses",
                            "templateUrl" : "editors/virus/index.html"
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "Virus",
                                "route" : {
                                    "name": "vd.forms.viruses.summary",
                                    "url": "/summary",
                                    "templateUrl": "editors/virus/summary.html"
                                },
                                "noDataSources" : {
                                    "viruses": {
                                        "provider": "noIndexedDB",
                                        "tableName": "VirusSamples",
                                        "model": {
                                            "id": "VirusSampleID",
                                            "fields": {
                                                "DateCreated": {
                                                    "type": "date"
                                                    },
                                                "Source": {},
                                                "SourceLocation": {},
                                                "QuantitySampled": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "DateSampled", "dir": "desc"}
                                        ],
                                        "expand": {
                                            "LocationID": {
                                                "name": "location",
                                                "provider": "noIndexedDB",
                                                "tableName": "LU_Location",
                                                "foreignKey": "LocationID",
                                                "fields": [
                                                    "Description"
                                                ]
                                            }
                                        }
                                    }
                                },
                                "noComponents" : {
                                    "viruses" : {
                                        "tableName": "VirusSamples",
                                        "primaryKey": "VirusSampleID",
                                        "toState": "vd.forms.viruses.editor",
                                        "rowTemplate": "#VirusViewTmpl",
                                        "altRowTemplate": "#VirusViewAltTmpl",
                                        "columns": [
                                            {"field": "DateCreated", "title": "Date Created", "type": "date"},
                                            {"field": "Source"},
                                            {"field": "SourceLocation", "title": "Source Location"},
                                            {"field": "ProcedureIfPositiveResult", "title": "Quantity Sampled"}
                                         ]
                                    }
                                }
                            },
                            {"name": "editor",
                                "title": "Virus - Editor",
                                "route": {
                                    "name": "vd.forms.viruses.editor",
                                    "url": "/edit/:VirusSampleID",
                                    "templateUrl": "editors/virus/editor.html"
                                },
                                "noDataSources": {
                                    "virus": {
                                        "provider": "noIndexedDB",
                                        "tableName": "VirusSamples",
                                        "sort": [
                                            {"field": "VirusSampleID", "dir": "asc"}
                                        ],
                                        "filter": [
                                            {"field": "VirusSampleID", "operator": "eq", "value": {
                                                "source": "state",
                                                "property": "VirusSampleID",
                                                "type": "string"
                                            }}
                                        ]
                                    },
                                    "selection": {
                                        "provider": "noIndexedDB",
                                        "tableName": "Selections",
                                        "model": {
                                            "id": "SelectionID",
                                            "fields": {
                                                "SelectionID": {},
                                                "SelectionCode": {}
                                            }
                                        },
                                        "sort": [
                                            {"field": "SelectionCode", "dir": "asc"}
                                        ]
                                    }
                                },
                                "noComponents" : {
                                    "virus": {
                                        "name": "virus",
                                        "tableName": "VirusSamples",
                                        "primaryKey": {
                                            "name": "VirusSampleID",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {"name": "reports",
                "noMenu": {
                    "title": "Reports"
                }
            },
            {"name": "system",
                "noMenu": {
                    "title": "System",
                    "glyph": "<span class=\"pull-right hidden-xs showopacity glyphicon glyphicon-cog\"></span><span class=\"caret\"></span>",
                    "sid": "86e4a293-2809-4c46-bad4-f213049f3bca"
                },
                "childAreas": [
                    {"name": "lookups",
                        "noMenu": {
                            "title": "Reference Data",
                            "state": "vd.lookups",
                            "sid": "73dc9b57-0e24-40c4-aec2-a95d36a05583"
                        },
                        "route": {
                            "name": "vd.lookups",
                            "url": "/lookups",
                            "templateUrl": "lookups/index.html"
                        }
                    },
                    {"name": "userManager",
                        "noMenu": {
                            "title": "User Manager",
                            "state": "vd.userman.summary",
                            "sid": "e162eb17-d5a7-4709-add6-297c1c7bf87a",
                            "noAppStatus": ["isRestServiceOnline"]
                        },
                        "route": {
                            "name": "vd.userman",
                            "url": "/userman",
                            "templateUrl": "userManager/index.html",
                            "abstract": true
                        },
                        "childAreas": [
                            {"name": "summary",
                                "title": "User Manager - Browse Users",
                                "route": {
                                    "name": "vd.userman.summary",
                                    "url": "/summary",
                                    "templateUrl": "userManager/summary.html"
                                },
                                "noDataSources": {
                                    "users": {
                                        "pageSize": 20,
                                        "provider": "noHTTP",
                                        "tableName": "NoInfoPath_Users",
                                        "model": {
                                            "id": "UserID",
                                            "fields": {
                                                "EmailAddress": {},
                                                "FirstName": {},
                                                "LastName": {}
                                            }
                                        },
                                        "sort": [{
                                            "field": "EmailAddress",
                                            "dir": "asc"
                                        }]
                                    }
                                },
                                "noComponents": {
                                    "users": {
                                        "pageSize": 20,
                                        "primaryKey": "UserID",
                                        "toState": "vd.userman.manage",
                                        "columns": [
                                            {"field": "EmailAddress"},
                                            {"field": "FirstName"},
                                            {"field": "LastName"}
                                        ]
                                    }
                                }
                            },
                            {"name": "register",
                                "title": "User Manager - Register New User",
                                "route": {
                                    "name": "vd.userman.register",
                                    "url": "/register/:UserID",
                                    "templateUrl": "userManager/registration.html"
                                }
                            },
                            {"name": "manageUser",
                                "title": "User Manager - Manage User",
                                "route": {
                                    "name": "vd.userman.manage",
                                    "url": "/manage/:UserID",
                                    "templateUrl": "userManager/manage.html"
                                },
                                "noDataSources": {
                                    "user": {
                                        "provider": "noHTTP",
                                        "tableName": "NoInfoPath_Users",
                                        "filter": [
                                            {
                                                "field": "UserID",
                                                "operator": "eq",
                                                "value": {
                                                    "source": "state",
                                                    "property": "UserID",
                                                    "type": "string"
                                                }
                                            }
                                        ]
                                    },
                                    "groups": {
                                        "provider": "noHTTP",
                                        "tableName": "/NoInfoPathGroups",
                                        "model": {
                                            "id": "GroupID",
                                            "fields": {
                                                "GroupName": {}
                                            }
                                        },
                                        "sort": [{
                                            "field": "GroupName",
                                            "dir": "asc"
                                        }],
                                        "filter": [
                                            {
                                                "field": "UserID",
                                                "operator": "eq",
                                                "value": {
                                                    "source": "state",
                                                    "property": "UserID",
                                                    "type": "string"
                                                }
                                            }
                                        ]
                                    },
                                    "usergroups": {}
                                },
                                "noComponents": {
                                    "user": {},
                                    "groups": {}
                                }
                            }
                        ]
                    },
                    {"name": "settings",
                        "noMenu": {
                            "title": "Settings",
                            "state": "vd.settings"
                        },
                        "route": {
                            "name": "vd.settings",
                            "url": "/settings",
                            "templateUrl": "settings/data-store.html"
                        }
                    }
                ]
            }
        ]
    }
};
