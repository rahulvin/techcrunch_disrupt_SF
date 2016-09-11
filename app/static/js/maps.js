$(document).ready(function(){
    // Initialize the platform object:
    var platform = new H.service.Platform({
        'app_id': '6pULDBl1OMCzgGo0SusZ',
        'app_code': 'M10yb8dGd9imFIxvwXGA5Q'
    });

    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.normal.map,
        {
          zoom: 10,
          center: { lng: 13.4, lat: 52.51 }
        }
    );
    var mapEvents = new H.mapevents.MapEvents(map);
    map.addEventListener('tap', function(evt) {
        // Log 'tap' and 'mouse' events:
        console.log(evt.type, evt.currentPointer.type);
    });
    var behavior = new H.mapevents.Behavior(mapEvents);
});