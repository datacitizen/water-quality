L.PointifexLayer = L.GeoJSON.extend({
	initialize: function (options) {
	    
	    var self = this;
	    L.Util.setOptions(this, options);
	    
	    this._geojson = null;
		this._layers = {};
	    
		this.on('updateBounds', function(options) {
		    self.update(options);
		});
	},
	
	update: function(options) {
	    
	    console.log(options.bounds);
	    
	    var bounds = options.bounds,
	        args = [
                bounds.getSouthWest().lng,
                bounds.getSouthWest().lat,
                bounds.getNorthEast().lng,
                bounds.getNorthEast().lat
            ],
            sourceUrl = 'data?bbox=' + args.join(','),
            self = this;

        console.log('call '+ sourceUrl);

        $.ajax({
            url: sourceUrl,
            dataType: 'json',
            success: function(data) {                
                self.clearLayers();
                self.addGeoJSON(data);
                self.fire('updated', data);
            }
        });	    
	}
});