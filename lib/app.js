
var views = exports.views = {
    makes: {
        map: function (doc) {
            if (doc.make)
                emit(doc.make, null);
        }
    }
};


