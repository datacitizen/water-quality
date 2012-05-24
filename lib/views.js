

exports.points = {
    map : function(doc) {
        if (doc.properties && doc.properties.GEONAME) {
            var name = doc.properties.GEONAME.toLowerCase();
            var names = name.split(/[^a-z0-9\-_]+/i);
            for (var i = 0; i < names.length; i++) {
                var atom = names[i];
                if (atom && atom.length > 0) {
                    emit(names[i], null);
                }
            }
        }
    }
}

exports.stations = {
    map : function(doc) {
        if (doc.type && doc.type == 'station') {
            emit(doc.name, doc);
        }
    }
}


exports.measurement_by_station_and_date = {
    map : function(doc) {

        if (doc.source){
            var normalized_source = doc.source.trim().replace(/ /g, '_');
            if (doc.source == 'wqi_sample_value') {
                var day, month, year;

                if (doc.sampledatetime.indexOf('-') > 0) {
                    var date_array = doc.sampledatetime.split('-');
                    year  = Number(date_array[0]);
                    month = Number(date_array[1]);
                    day   = Number(date_array[2]);
                } else {
                    var toParse = doc.sampledatetime;
                    if (doc.sampledatetime.indexOf(' ') > 0) {
                        toParse = doc.sampledatetime.substring(0, doc.sampledatetime.indexOf(' '));
                    }



                    var date_array = toParse.split('/');
                    year  = Number(date_array[2]);
                    month = Number(date_array[1]);
                    day   = Number(date_array[0]);
                }

                emit([doc.stationid, doc.variableid.toLowerCase(), year, month, day], Number(doc.resultvalue))
            } else {
                var _ = require('views/lib/underscore')._;
                var some_fun_date_stuff = new Date();
                var year = Number(doc.year);
                var month = doc.month;
                var day = doc.day;




                var props = _.without(_.keys(doc), "_id", "_rev", "year", "date", "rowNumber", "source", "import_date");
                _.each(props, function(prop) {
                    try {
                        var result = Number(doc[prop]);
                        if (_.isNumber(result) && result > 0) {
                            emit([normalized_source, prop, year, month, day], result);
                        }
                    } catch (e){}
                });

            }

        }
    },
    reduce: '_stats'

}
