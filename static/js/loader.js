var db = require('db').use('_db');
var _  = require('underscore')._;

$(function(){



    $('.fort_smith').click(function(){
        $(this).attr('disabled', 'disabled');
        Tabletop({
            key: '0AhQVbLcvyJvIdGgwVFVLUWZUanRaaHlRb3pDempSVnc',
            simpleSheet: false,
            wanted: [ "wqi_sample_value" ],
            callback : function(data, tabletop) {
                var data = _.map(data.wqi_sample_value.elements, function(row){
                    row.source = 'wqi_sample_value';
                    row.import_date = new Date().getTime();
                    return row;
                });
                db.bulkSave(data, function(err, response) {
                   if (err) console.log('error:', err);
                });
            }
        });
    });


    $('.north_sites').click(function(){
        $(this).attr('disabled', 'disabled');
        Tabletop({
            key: '0AhQVbLcvyJvIdEEtX0dkOG1Xd0lpUXNualEwYVVFbEE',
            simpleSheet: false,
            wanted: [ "Salt River Data", "Buffalo River Data", "L Buffalo River ", "Kakisa River Data", "Hay River West Channel", "Slave Mouth Data" ],
            callback : function(data, tabletop) {

                var sources = _.keys(data);
                _.each(sources, function(source) {
                    var data_annotated = _.map(data[source].elements, function(row){
                        row.source = source;
                        row.import_date = new Date().getTime();
                        return row;
                    });

                    db.bulkSave(data_annotated, function(err, response) {
                       if (err) console.log('error:', err);
                    });
                });


            }
        });

    });


})