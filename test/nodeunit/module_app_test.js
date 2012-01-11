
var app = require('../../lib/app');

exports.testSomething = function(test){

    var doc = {
        make : 'Honda'
    }
    app.views.makes.map(doc);
    test.equal(1, app.views.results.length, "Doc emitted");
    test.equal("Honda", app.views.results[0].key, "Correct key");

    test.done();
};