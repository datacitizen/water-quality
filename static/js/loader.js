var db = require('db').use('_db');
var _  = require('underscore')._;

$(function(){



    $('.fort_smith').click(function(){
        $(this).attr('disabled', 'disabled');
        Tabletop({
            key: '0AhQVbLcvyJvIdEEtX0dkOG1Xd0lpUXNualEwYVVFbEE',
            simpleSheet: false,
            wanted: [ "wqi_sample_value" ],
            callback : function(data, tabletop) {
                var data = _.map(data.wqi_sample_value.elements, function(row){
                    row.source = 'wqi_sample_value';
                    row.type = 'reading';
                    row.import_date = new Date().getTime();
                    return row;
                });
                db.bulkSave(data, function(err, response) {
                   if (err) console.log('error:', err);
                    alert('complete!');
                });
            }
        });
    });


    $('.north_sites').click(function(){
        $(this).attr('disabled', 'disabled');
        Tabletop({
            key: '0AhQVbLcvyJvIdGgwVFVLUWZUanRaaHlRb3pDempSVnc',
            simpleSheet: false,
            wanted: [ "Salt River Data", "Buffalo River Data", "L Buffalo River ", "Kakisa River Data", "Hay River West Channel", "Slave Mouth Data" ],
            callback : function(data, tabletop) {

                var sources = _.keys(data);
                _.each(sources, function(source) {
                    var data_annotated = _.map(data[source].elements, function(row){
                        row.source = source.trim();
                        row.type = 'reading';
                        row.import_date = new Date().getTime();
                        if (row.date) {
                            var parsed = Date.parse(row.date);
                            if (parsed) {
                                row.month = parsed.getMonth();
                                row.day = parsed.getDate();
                            }
                            else {
                                console.log(['Error parsing date', row]);
                            }
                        }
                        return row;
                    });

                    db.bulkSave(data_annotated, function(err, response) {
                       if (err) console.log('error:', err);
                        alert('complete!');
                    });
                });


            }
        });

    });
    $('.nwt-drinking').click(function(){
        $(this).attr('disabled', 'disabled');

        // import stations
        Tabletop({
            key: '0AhQVbLcvyJvIdGJMNF9LdXpOckliSm43ZDNQX1lTSWc',
            simpleSheet: false,
            wanted: [ "Stations"],
            callback : function(data, tabletop) {
                var data = _.map(data.Stations.elements, function(row){
                    row.source = 'nwt_drinking_water';
                    row.import_date = new Date().getTime();
                    row.type = 'station';
                    row.name = row.community;
                    row.geometry = {
                        type : 'Point',
                        coordinates : [
                            row.lat,
                            row.lon
                        ]
                    }
                    return row;
                });
                db.bulkSave(data, function(err, response) {
                   if (err) console.log('error:', err);

                });
            }
        });


        Tabletop({
            key: '0AhQVbLcvyJvIdGJMNF9LdXpOckliSm43ZDNQX1lTSWc',
            simpleSheet: false,
            wanted: [ "Readings"],
            callback : function(data, tabletop) {
                var data = _.map(data.Readings.elements, function(row){
                    row.source = 'nwt_drinking_water';
                    row.type = 'reading';
                    row.import_date = new Date().getTime();
                    return row;
                });
                db.bulkSave(data, function(err, response) {
                   if (err) console.log('error:', err);
                    alert('complete!');
                });
            }
        });



    });


})
