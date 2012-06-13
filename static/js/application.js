var _ = require('underscore')._;
var handlebars = require('handlebars');
var db = require('db').use('_db');
var garden = require('garden-app-support');


dojo.require("esri.map");


var map;

function NWTPoint(lat, lng) {
    var source = new Proj4js.Proj("EPSG:4326");    //source coordinates will be in Longitude/Latitude
    var dest = new Proj4js.Proj("ESRI:102002");     //destination coordinates in LCC, south of France
    var p = new Proj4js.Point(lng, lat);   //any object will do as long as it has 'x' and 'y' properties
    Proj4js.transform(source, dest, p);      //do the transformation.  x and y are modified in place
    return new esri.geometry.Point(p.x, p.y, new esri.SpatialReference({ wkid: 102002 }));

}

function ShowLocation(lat, lng, name, site_url, colour) {
    //var point = new esri.geometry.Point(x, y, new esri.SpatialReference({ wkid: 102002 }));
    var point = NWTPoint(lat, lng);

    var img = './static/img/waterqualitystation_' + colour + '.png';

    var bluePin = new esri.symbol.PictureMarkerSymbol(img, 50, 50);
    var attr = { "Xcoord": 2, "Ycoord": 3, "Plant": "Mesa Mint" };
    var infoTemplate = new esri.InfoTemplate("Water Quality Station", name + " <br/> <a href='"+ site_url  +"'>View Station</a> ");
    var graphic = new esri.Graphic(point, bluePin, attr, infoTemplate);

    map.graphics.add(graphic);

}

function init() {
    //code to create the map and add a basemap will go here
    // map = new esri.Map("mapDiv");
    map = new esri.Map("mapDiv", {
        extent: new esri.geometry.Extent({ xmin: -1298626.3524921213, ymin: 2326258.678718359, xmax: -679500.1142396445, ymax: 2537925.7687192056, spatialReference: { wkid: 102002} })
    });
    var basemapURL = "http://sdw.enr.gov.nt.ca/ArcGIS/rest/services/GNWT/GNWTBasemapLCC/MapServer"
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(basemapURL);
    map.addLayer(basemap, "basemap");
    dojo.connect(map, "onLoad", getAllStations);
}

dojo.addOnLoad(init);

function getAllStations() {
    $.ajax({
        //url: './data?bbox=' + args.join(',') + '&limit=20',
        url: './stations' ,
        dataType: 'json',
        success: function(data) {
            _.each(data.rows, function(row) {
                var latLong = row.doc.geometry.coordinates;
                var site_url = '#/show/' + row.key.replace(/ /g, '_');
                var name = row.key;

                var colour = 'pink';
                console.log(row.doc);
                if (row.doc.source == 'wqi_sample_value') colour = 'green';
                if (row.doc.source == 'nwt_drinking_water') colour = 'yellow';


                if (row.doc.displayName) name = row.doc.displayName;

                ShowLocation(latLong[0], latLong[1], name, site_url, colour);
            });
        }
    });
}




function index() {

    $('#mapDiv').show();
    $('.content-area').empty();


}


function showStationScaled(station){
    showStation(station, true)
}

function showStation(station, normalize) {
    var name = station.replace(/_/g, ' ');

    var wiki_url = garden.createRedirectUrl('wiki', station);
    var questions_url = garden.createRedirectUrl('questions', station);

    $('#mapDiv').hide();

    $('.content-area').html(handlebars.templates['chart_by_year.html']({
        name : name,
        wiki_url : wiki_url,
        questions_url : questions_url,
        station: station,
        scale : normalize
    }));


    $.ajax({
        url: './stations/' + station + '/annual' ,
        dataType: 'json',
        success: function(data) {


            var memo = {};
            var plot = _.map(data.rows, function(row){
                var avg = row.value.sum / row.value.count;
                var point = { x : row.key[2], y : avg, name: row.key[1]  };

                if (normalize) {
                    var min_max = memo[point.name];
                    if (!min_max) {
                        min_max = {
                            min: point.y,
                            max: point.y
                        }
                    } else {
                        if (point.y < min_max.min) min_max.min = point.y;
                        if (point.y > min_max.max) min_max.max = point.y;
                    }
                    memo[point.name] = min_max;
                }
                return point;
            });

            if (normalize) {
                plot = _.map(plot, function(point){
                    var min_max = memo[point.name];
                    var range = min_max.max - min_max.min;
                    var d = point.y - min_max.min;


                    point.y = d/range;
                    return point
                });
            }


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
                width: 700,
                height: 500,
                renderer: 'line',
                series: series
            } );



            var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: graph,
                xFormatter: function(x) { return x + "" }
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

            var to_close = [];
            var $last_over;
            var debounced_about_measurement = _.debounce(function(){
                $('#legend span.label').popover('hide');
                $last_over.popover('show');

                to_close = [];
            }, 300);

            $('#legend span.label').on('mouseover', function(){
                $last_over = $(this);
                debounced_about_measurement();
            }).on('mouseout', function(){
                to_close.push($(this));
                $(document).one('click', function(){
                    $('#legend span.label').popover('hide');
                })
            }).each(function(){
                var $label = $(this);
                var measuement =  $label.text();

                var wiki_url = garden.createRedirectUrl('wiki', measuement);
                $label.popover({
                   title : measuement,
                   content : '<a href="'+ wiki_url +'">About</a> ',
                    trigger : 'manual'
                });
            });
            $('#chart').mouseover(function(){
                $('#legend span.label').popover('hide');
            });


        }
    });




}



var routes = {
  '/' : index,
  '/show/:id' : showStation,
  '/show/:id/scaled' : showStationScaled
};
var router = Router(routes);
router.init('/');