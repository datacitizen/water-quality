
var app = require('../../lib/app');

var results;
global.emit = function(key, value) {
    results.push({key : key, value : value});
};

module.exports = {
    setUp : function(callback) {
        results = [];
        callback();
    },    
    testDocWithMake : function(test){
       
        var doc = {
            make : 'Honda'
        }
        app.views.makes.map(doc);
        test.equal(1, results.length, "Doc emitted");
        test.equal("Honda", results[0].key, "Correct key");
        test.done();
    },
    testDocWithNoMake : function(test){

        var doc = {};
        app.views.makes.map(doc);
        test.equal(0, results.length, "No Doc emitted");
        test.done();
    }
    
}
    