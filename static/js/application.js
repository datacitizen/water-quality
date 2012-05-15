var _ = require('underscore')._;
var handlebars = require('handlebars');
var db = require('db').use('_db');


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
                console.log(data);
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


    function getAllStations() {
        $.ajax({
            //url: './data?bbox=' + args.join(',') + '&limit=20',
            url: './stations' ,
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



    function index() {

        $('.container').html(handlebars.templates['map_box.html']({}))
        // Map resolutions as defined on the MapServer information
        var ESRI102002 = L.CRS.proj4js(
                            'ESRI:102002',
                            '+proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
                            new L.Transformation(1, 0, -1, 0)
                        ),
            resolutions = [
                6614.59656252646,
                4233.34180001693,
                2116.67090000847,
                1058.33545000423,
                529.167725002117,
                264.583862501058,
                132.291931250529,
                99.2189484378969,
                66.1459656252646,
                33.0729828126323,
                19.8437896875794,
                13.2291931250529,
                9.26043518753704,
                5.29167725002117,
                2.64583862501058,
                1.32291931250529,
                0.264583862501058,
            ];

        // Provide the scale function for the projection
        ESRI102002.scale = function(zoomLevel) {
            return 1 / resolutions[zoomLevel];
        };

        // Setup leaflet
        var map = new L.Map('map', {
              crs: ESRI102002,
              continuousWorld: true
            }),
            canada = new L.TileLayer.AGSDynamic(
                              'http://sdw.enr.gov.nt.ca/ArcGIS/rest/services/GNWT/GNWTBasemapLCC/MapServer',
                                   {  maxZoom: resolutions.length - 1,
                                      minZoom: 0,
                                      attribution: "To be advised",
                                      cacheBuster: true,
                                      continuousWorld: true,
                                      transparent: false }),

            // For the future - implement the tile based layer to work of the zyx ArcGIS url
            // mapUrl = 'http://sdw.enr.gov.nt.ca/ArcGIS/rest/services/GNWT/GNWTBasemapLCC/MapServer/tile/{z}/{y}/{x}'
            //     canada = new L.TileLayer(mapUrl, {
            //             scheme: 'xyz',
            //             maxZoom: resolutions.length - 1,
            //             minZoom: 0,
            //             continuousWorld: false,
            //             attribution: 'To be advised'
            //         }),

            center = new L.LatLng(64.47279382008166, -101.07421875),
            searchLayer = null;

        map.setView(center, 1).addLayer(canada);

        function getAllStations1() {
            $.ajax({
                //url: './data?bbox=' + args.join(',') + '&limit=20',
                url: './stations1' ,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    _.each(data.rows, function(row) {
                        console.log(row.value.geometry.coordinates);
                        var latLong = row.value.geometry.coordinates;
                        var marker = new L.Marker(new L.LatLng(latLong[0], latLong[1]));
                        map.addLayer(marker);

                        var site_url = row.key.replace(/ /g, '_');

                        marker.bindPopup('<b>' + row.key + '</b><br />Water Quality Station. <br/><a href="#/show/'+site_url+'">View Data</a>  ')
                    });
                }
            });
        }
        getAllStations1();


        map.on('dragend', function(evt) {
            //getAllStations();
            //updateItemsDebounced(map.getBounds());
        });
        map.on('zoomend', function(evt) {
            //updateItemsDebounced(map.getBounds());
        });
    }


    function showStation(station) {
        $('.container').html(handlebars.templates['chart_by_year.html']({name : station}));
        $.ajax({
            url: './stations/' + station + '/annual' ,
            dataType: 'json',
            success: function(data) {

                var plot = _.map(data.rows, function(row){
                    var avg = row.value.sum / row.value.count;
                    return { x : row.key[2], y : avg, name: row.key[1]  };
                });



                var byMetric = _.groupBy(plot,function(row){ return row.name  });


                var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );
                var series = [];
                _.each(_.keys(byMetric), function(key){
                    var item = {
                        color: palette.color(),
                     	data: byMetric[key],
                     	name: key
                    }
                    series.push(item);
                });


                Rickshaw.Series.zeroFill(series);



                var graph = new Rickshaw.Graph( {
                	element: document.getElementById("chart"),
                	width: 760,
                	height: 500,
                	renderer: 'line',
                	series: series
                } );



                var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                    graph: graph
                } );

                graph.render();

                var legend = new Rickshaw.Graph.Legend( {
                	graph: graph,
                	element: document.getElementById('legend')

                } );

                var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
                	graph: graph,
                	legend: legend
                } );



                var highlight = new Rickshaw.Graph.Behavior.Series.Highlight( {
                	graph: graph,
                	legend: legend
                } );

            }
        });




    }

    var routes = {
      '/' : index,
      '/show/:id' : showStation
    };
    var router = Router(routes);
    router.init('/');

});