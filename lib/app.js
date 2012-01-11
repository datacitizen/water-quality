
var views = exports.views = {
    makes: {
        map: function (doc) {
            emit(doc.make, null);
        }
    }
};


/* For testing. This mocks the emit function. */
var emit = emit || function(key, value) {
    if (!views.results) views.results = [];
    views.results.push({key : key, value : value});
};
