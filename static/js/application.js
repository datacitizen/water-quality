var _ = require('underscore')._;

$(document).ready(function(){

    var geojson;

    var updateItemsDebounced = _.debounce(updateItems, 1000);


    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    function updateItems(bounds) {
        var args = [
            bounds.getSouthWest().lng,
            bounds.getSouthWest().lat,
            bounds.getNorthEast().lng,
            bounds.getNorthEast().lat
        ];
        $.ajax({
            //url: './data?bbox=' + args.join(',') + '&limit=20',
            url: './data?bbox=' + args.join(',') ,
            dataType: 'json',
            success: function(data) {
                if (geojson) {
                    map.removeLayer(geojson);
                }
                geojson = new L.GeoJSON(null, {
                    pointToLayer: function (latlng) {
                        return new L.CircleMarker(latlng, geojsonMarkerOptions);
                    }
                });
                geojson.on("featureparse", function (e) {
                    if (e.properties && e.properties.properties){
                        e.layer.bindPopup(e.properties.properties.GEONAME);
                    }
                });
                geojson.addGeoJSON(data);
                map.addLayer(geojson);
            }
        });

    }

    // initialize the map on the "map" div with a given center and zoom
    var map = new L.Map('map', {

        center: new L.LatLng(60.047222, -112.771389),
        zoom: 6
    });

    // create a CloudMade tile layer
    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18});

    // add the CloudMade layer to the map
    map.addLayer(cloudmade);

    map.on('dragend', function(evt) {
        updateItemsDebounced(map.getBounds());
    });
    map.on('zoomend', function(evt) {
        updateItemsDebounced(map.getBounds());
    });

});