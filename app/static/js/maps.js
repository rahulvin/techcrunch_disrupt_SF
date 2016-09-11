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
   var x = parseInt(duration)
    console.log(geocodingParams)
    // Define a callback function to process the geocoding response:
    for(ip = 0;ip< duration;ip++){
    console.log(document.getElementById('mapContainer'+ip))
    var onGeoCodeResult = function(result) {

      var results = []
      var locations = result.Response.View[0].Result,
        position,
        marker;
                // Instantiate (and display) a map object:
      var map = new H.Map(
        document.getElementById('mapContainer'+ip),
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
    }
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
          var food_items =[]
           var other_items = []
          for (i=0; i<5; i++){
              var a = parseInt(Math.floor((Math.random() * food_places.length)));
              var b = parseInt(Math.floor((Math.random() * others.length)));
              console.log(a)
              console.log(b)
              if(i<2){
                 food_items.push(food_places[a])
              }else {
                 other_items.push(others[b])
              }
          }
          group.addObjects(food_items.map(function (place) {
              var marker = new H.map.Marker({lat: place.position[0],
                lng: place.position[1]})
              console.log(place)
              marker.title = place.title + "<br>" + place.category.title
              return marker;
          }));
          group.addObjects(other_items.map(function (place) {
              var marker = new H.map.Marker({lat: place.position[0],
                lng: place.position[1]})
              console.log(place)
              marker.title = place.title + "<br>" + place.category.title
              return marker;
          }));
          var i = 0
          var url = 'https://matrix.route.cit.api.here.com/routing/7.2/calculatematrix.json?app_id=6pULDBl1OMCzgGo0SusZ&app_code=M10yb8dGd9imFIxvwXGA5Q'
          var end = '&mode=fastest;car;traffic:disabled'
          var e;
          var route=[];
          while( i != 5){
            if(i % 2 == 0){
               e = other_items.pop()
                route.push(e)
            } else {
                e = food_items.pop()
                route.push(e)
            }
            i++;
          }
          var a=0,b=1;
          while(b!= 5){
            drawroute(route[a],route[b], map);
            b++;
            a++;
          }
        }
    }
//ENDSEARCH
//BEGIN ROUTING
function drawroute(c1,c2, map){
    // Create the parameters for the routing request:
var routingParameters = {
  // The routing mode:
  'mode': 'fastest;car',
  // The start point of the route:
  'waypoint0': 'geo!'+c1.position[0]+','+c1.position[1],
  // The end point of the route:
  'waypoint1': 'geo!'+c2.position[0]+','+c2.position[1],
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  'representation': 'display'
};

// Define a callback function to process the routing response:
var onResult = function(result) {
  var route,
    routeShape,
    startPoint,
    endPoint,
    strip;
  if(result.response.route) {
  // Pick the first route from the response:
  route = result.response.route[0];
  // Pick the route's shape:
  routeShape = route.shape;

  // Create a strip to use as a point source for the route line
  strip = new H.geo.Strip();

  // Push all the points in the shape into the strip:
  routeShape.forEach(function(point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  // Retrieve the mapped positions of the requested waypoints:
  startPoint = route.waypoint[0].mappedPosition;
  endPoint = route.waypoint[1].mappedPosition;

  // Create a polyline to display the route:
  var routeLine = new H.map.Polyline(strip, {
    style: { lineWidth: 10 },
    arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
  });

  // Add the route polyline and the two markers to the map:
  map.addObjects([routeLine]);

  }
};

// Get an instance of the routing service:
var router = platform.getRoutingService();

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult,
  function(error) {
    alert(error.message);
  });
}
//ENDROUTING

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