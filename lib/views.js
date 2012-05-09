

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
            };
        }
    }
}

