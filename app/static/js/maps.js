$(document).ready(function(){
    // Initialize the platform object:
    var platform = new H.service.Platform({
      useCIT: true,

        'app_id': '6pULDBl1OMCzgGo0SusZ',
        'app_code': 'M10yb8dGd9imFIxvwXGA5Q'
    });



//GEOCODE
    // Create the parameters for the geocoding request:
   var geocodingParams = {
     searchText: city_of_travel,
   };
    console.log(geocodingParams)
    // Define a callback function to process the geocoding response:
    var onGeoCodeResult = function(result) {

      var results = []
      var locations = result.Response.View[0].Result,
        position,
        marker;
                // Instantiate (and display) a map object:
      var map = new H.Map(
        document.getElementById('mapContainer'),
        platform.createDefaultLayers().normal.map,
        {
          zoom: 15,
          center: {
            lat: locations[0].Location.DisplayPosition.Latitude,
            lng: locations[0].Location.DisplayPosition.Longitude
          },
        }
      );
      tooltip = new Tooltip(map);

      var mapEvents = new H.mapevents.MapEvents(map);
      map.addEventListener('tap', function (evt) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
        geocodingParams = {
            searchText: city_of_travel,
        };
      });
      var behavior = new H.mapevents.Behavior(mapEvents);
      // Add a marker for each location found
      for (i = 0;  i < locations.length; i++) {
          position = {
            lat: locations[i].Location.DisplayPosition.Latitude,
            lng: locations[i].Location.DisplayPosition.Longitude
          };
          search(position, map,'eat-drink')
          console.log(position)
      }
      return results
    };

    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();

    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    var coords = geocoder.geocode(geocodingParams, onGeoCodeResult, function(e) {
      alert(e);
    });
//ENDGEOCODE
    function search(coords, map, category) {
    //SEARCH
            // Create a group object to hold map markers:
        var group = new H.map.Group();

        // Create the default UI components:
        var ui = H.ui.UI.createDefault(map, platform.createDefaultLayers());

        // Add the group object to the map:
        map.addObject(group);

        // Obtain a Search object through which to submit search
        // requests:
        var explore = new H.places.Explore(platform.getPlacesService()), onSearchResult, error;
        console.log(explore)
        // Define search parameters:
        var params = {
        // Plain text search for places with the word "hotel"
        // associated with them:
          'cat': 'sights-museum,eat-drink,going-out',
          'size': 100,
        //  Search in the Chinatown district in San Francisco:
          'at': coords.lat+',' + coords.lng
        };
        // Run a search request with parameters, headers (empty), and
        // callback functions:
        explore.request(params, {}, onSearchResult, onError);        // Define a callback function to handle data on success:
        function onSearchResult(data) {
          addPlacesToMap(data.results);
        }

        // Define a callback function to handle errors:
        function onError(data) {
          error = data;
        }


        // This function adds markers to the map, indicating each of
        // the located places:
        function addPlacesToMap(result) {
          var food_places = []
          var others= []
          for (i= 0;i<100;i++){
            if(result.items[i].category.title == 'Restaurant' ||
             result.items[i].category.title == 'Bar/Pub' ||
             result.items[i].category.title =="Snacks/Fast food" ||
              result.items[i].category.title == 'Coffee/Tea') {
                food_places.push(result.items[i])
            } else {
                others.push(result.items[i])
            }
          }
          console.log(food_places)
          console.log(others)
          var new_items = []
          for (i=0; i<5; i++){
              var a = parseInt(Math.floor((Math.random() * food_places.length)));
              var b = parseInt(Math.floor((Math.random() * others.length)));
              console.log(a)
              console.log(b)
              if(i<2){
                 new_items.push(food_places[a])
              }else {
                 new_items.push(others[b])
              }
          }
          group.addObjects(new_items.map(function (place) {
          var marker = new H.map.Marker({lat: place.position[0],
            lng: place.position[1]})
          console.log(place)
          marker.title = place.title + "<br>" + place.category.title
          return marker;
          }));
        }


    }
//ENDSEARCH

});

(function (ctx) {
  // ensure CSS is injected
  var tooltipStyleNode = ctx.createElement('style'),
    css = '#nm_tooltip{' +
      ' color:white;' +
      ' background:black;' +
      ' border: 1px solid grey;' +
      ' padding-left: 1em; ' +
      ' padding-right: 1em; ' +
      ' display: none;  ' +
      ' min-width: 120px;  ' +
      '}';

  tooltipStyleNode.type = 'text/css';
  if (tooltipStyleNode.styleSheet) { // IE
    tooltipStyleNode.styleSheet.cssText = css;
  } else {
    tooltipStyleNode.appendChild(ctx.createTextNode(css));
  }
  if (ctx.body) {
    ctx.body.appendChild(tooltipStyleNode);
  } else if (ctx.addEventListener) {
    ctx.addEventListener('DOMContentLoaded',  function () {
      ctx.body.appendChild(tooltipStyleNode);
    }, false);
  } else {
    ctx.attachEvent('DOMContentLoaded',  function () {
      ctx.body.appendChild(tooltipStyleNode);
    });
  }
})(document);


Object.defineProperty(Tooltip.prototype, 'visible', {
  get: function() {
    return this._visible;
  },
  set: function(visible) {
    this._visible = visible;
    this.tooltip.style.display = visible ? 'block' : 'none';
  }
});


function Tooltip(map) {
  var that = this;
  that.map = map;
  that.tooltip  = document.createElement('div');
  that.tooltip.id = 'nm_tooltip';
  that.tooltip.style.position = 'absolute';
  obj = null,
  showTooltip = function () {
    var point = that.map.geoToScreen(obj.getPosition()),
      left = point.x - (that.tooltip.offsetWidth / 2),
      top = point.y + 1; // Slight offset to avoid flicker.
    that.tooltip.style.left = left + 'px';
    that.tooltip.style.top = top + 'px';
    that.visible = true;
    that.tooltip.innerHTML =  obj.title;
  };


  map.getElement().appendChild(that.tooltip);
  map.addEventListener('pointermove', function (evt) {
    obj = that.map.getObjectAt(evt.currentPointer.viewportX,
        evt.currentPointer.viewportY);
    if(obj && obj.title){
      showTooltip();
    } else {
      that.visible = false;
    }
  });

  map.addEventListener('tap', function (evt){
    that.tooltip.visible  = false;
  });
  map.addEventListener('drag', function (evt){
    if (that.visible) {
      showTooltip();
    }
  });
};