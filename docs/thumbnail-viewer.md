[NoInfoPath Home](http://gitlab.imginconline.com/noinfopath/noinfopath/wikis/home)

___

[NoInfoPath UI (noinfopath-ui)](home)  *@version 2.0.59 *

[![build status](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/badges/master/build.svg)](http://gitlab.imginconline.com/noinfopath/noinfopath-ui/commits/master)

Copyright (c) 2017 The NoInfoPath Group, LLC.

Licensed under the MIT License. (MIT)

___

noThumbnailViewer Directive
------------------------



## noThumbnailViewerService

### Dependecies
+ $compile
+ $state
+ noFormConfig
+ PubSub
+ noNavigationManager
+ noTransactionCache
+ noLoginService
+ $rootScope
+ $q

### What is this for?
This service provides an API for outside NoInfoPath libraries (like noActionQueue) to interact with the `noThumbnailViewerDirective`. In also
provides the methods neccesary that are called as hooks in the `no-dnd` (The code behind the drag and drop).
The functions that are used by the drag and drop are as follows:

 | Method Name | Description                                                                                                                                                                                                        |
 |-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | dragstart   | When the element is started to be dragged, this code pulls the `file-id` off of the attribute of the element. This `file-id` is considered the `dataTransfer`, if you know anything about HTML5 drag and drop.     |
 | dragover    | All this function does is true. If a `drag` event should be disabled for any reason, additional code can be added here and return false.                                                                           |
 | drop        | The drop is the complicated piece of code. When an element is dropped, this basically removes the element and places it in the correct position. Then, the `_idList` is updated, and the `navbar` state is changed |
 | click       | This event is triggered whenever an draggable element is clicked.                                                                                                                                                  |

The other methods included are pretty self explanatory. The `cancel` method reverts the navbar to original state and undoes any changes. The `changeToDirtyNavbar` and
`changeToNormalNavbar` methods do what they say, and are called in the Directive and in this service. They use the `PubSub` mechanism to achieve this, in a way that
fakes the way that it is normally done by actual validation.

The `save` method uses noTransactionCache to save to the `json` that tells it what dbName and dbTable to write to. See example config below.



There is an internal array that takes care of the data called `_idList`. More about this to follow. The flow of the drag and drop can basically be summed
up to be as follows.

1. User *DRAGS* a Thumbnail.
2. `dragstart` method fired
3. The thumbnail that is being dragged gets the `.dndDraggingSource` source class, which hides it to simulate that the user is picking it up and moving it.
3. `no-dnd-lists` code creates a placeholder element, and auto positions it based on mouse pointer.
4. User *DROPS* a Thumbnail.
5. `drop` method fired, and passes the location of where it is dropped relative to the other elements.
5. The inner `_idList` is updated to reflect the new location.
6. The `OrderBy` field is updated on each element to be the correct one.
6. Thumbnail that is being moved is removed from the DOM, and placed where it needs to go.
7. If the viewer is not already dirty, then it will change the navbar to the dirty navbar.



## noThumbnailViewerDirective

### Dependecies
+ A `no-kendo-grid` as a sibling element

### Example
```html
<no-kendo-grid no-form="noForm.noComponents.photos"></no-kendo-grid>
<no-thumbnail-viewer dnd-list draggable-thumbnails="true" no-form="noForm.noComponents.photos"></no-thumbnail-viewer>
```
The `no-form` property should point to the same hive that is pointed to by the `no-kendo-grid`. If you wish to have drag-and-drop capabilites,
first make sure you have the `noDndList` module, and that you include the `dnd-list` and `draggable-thumbnails='true'` attributes.


This hive should be inside the same hive within the grid.
```js
 "noThumbnailViewer": {
     "saveDataOnScopeAs": "reportPhotoOrderInfo",
     "dbName": "rmEFR2",
     "dbTable": "Documents"
 },
```





